# How to Use the Advanced Math Module in PubNub Functions 2.0

The `advanced_math` module in PubNub Functions provides specialized mathematical functions, particularly focused on geospatial calculations. This module is essential for location-based applications, distance calculations, and geographic data processing.

## Requiring the Advanced Math Module

To use the `advanced_math` module, you first need to require it in your Function:

```javascript
const advancedMath = require("advanced_math");
```

## Core Methods

The advanced math module provides synchronous mathematical functions that return values immediately (not Promises).

### 1. `advancedMath.getDistance(lat1, lon1, lat2, lon2)`

Calculate the distance between two geographic coordinates using the Haversine formula.

*   `lat1` (Number): Latitude of the first point in decimal degrees.
*   `lon1` (Number): Longitude of the first point in decimal degrees.
*   `lat2` (Number): Latitude of the second point in decimal degrees.
*   `lon2` (Number): Longitude of the second point in decimal degrees.
*   Returns the distance in **miles** as a floating-point number.

```javascript
// Calculate distance between New York City and Los Angeles
const nycLat = 40.7128, nycLon = -74.0060;
const laLat = 34.0522, laLon = -118.2437;

const distance = advancedMath.getDistance(nycLat, nycLon, laLat, laLon);
console.log(`Distance from NYC to LA: ${distance.toFixed(2)} miles`);
// Output: Distance from NYC to LA: 2445.55 miles

// Calculate distance between two nearby points
const point1Lat = 37.7749, point1Lon = -122.4194; // San Francisco
const point2Lat = 37.7849, point2Lon = -122.4094; // Nearby location

const shortDistance = advancedMath.getDistance(point1Lat, point1Lon, point2Lat, point2Lon);
console.log(`Short distance: ${shortDistance.toFixed(3)} miles`);
// Output: Short distance: 0.876 miles
```

### 2. `advancedMath.deg2rad(degrees)`

Convert degrees to radians for mathematical calculations.

*   `degrees` (Number): The angle in degrees to convert.
*   Returns the equivalent angle in radians.

```javascript
// Convert common angles to radians
const degrees90 = advancedMath.deg2rad(90);
console.log(`90 degrees = ${degrees90} radians`); // 1.5707963267948966 (π/2)

const degrees180 = advancedMath.deg2rad(180);
console.log(`180 degrees = ${degrees180} radians`); // 3.141592653589793 (π)

const degrees360 = advancedMath.deg2rad(360);
console.log(`360 degrees = ${degrees360} radians`); // 6.283185307179586 (2π)

// Use in custom calculations
const angle = 45; // degrees
const radians = advancedMath.deg2rad(angle);
const sineValue = Math.sin(radians);
console.log(`sin(${angle}°) = ${sineValue.toFixed(3)}`); // sin(45°) = 0.707
```

## Practical Examples

### Example 1: Location-Based Service and Geofencing

```javascript
export default async (request) => {
  const advancedMath = require("advanced_math");
  const pubnub = require("pubnub");
  const db = require("kvstore");
  
  try {
    const locationData = request.message;
    const userLat = locationData.latitude;
    const userLon = locationData.longitude;
    const userId = locationData.userId;
    
    // Validate coordinates
    if (!userLat || !userLon || !userId) {
      console.log('Invalid location data');
      return request.abort();
    }
    
    // Define points of interest with their coordinates
    const pointsOfInterest = [
      { id: 'starbucks_downtown', name: 'Starbucks Downtown', lat: 37.7849, lon: -122.4094, radius: 0.1 },
      { id: 'central_park', name: 'Central Park', lat: 40.7829, lon: -73.9654, radius: 0.5 },
      { id: 'golden_gate', name: 'Golden Gate Bridge', lat: 37.8199, lon: -122.4783, radius: 0.2 },
      { id: 'times_square', name: 'Times Square', lat: 40.7580, lon: -73.9855, radius: 0.3 }
    ];
    
    const nearbyPOIs = [];
    const geofenceAlerts = [];
    
    // Check distance to each point of interest
    for (const poi of pointsOfInterest) {
      const distance = advancedMath.getDistance(userLat, userLon, poi.lat, poi.lon);
      
      if (distance <= poi.radius) {
        // User is within geofence
        geofenceAlerts.push({
          poiId: poi.id,
          poiName: poi.name,
          distance: distance,
          action: 'entered'
        });
        
        // Check if this is a new entry
        const lastLocationKey = `last_location:${userId}:${poi.id}`;
        const lastEntry = await db.get(lastLocationKey);
        
        if (!lastEntry || (Date.now() - lastEntry.timestamp) > 300000) { // 5 minutes
          // Send notification for new geofence entry
          await pubnub.publish({
            channel: `user.${userId}.notifications`,
            message: {
              type: 'geofence_entry',
              poi: poi.name,
              distance: distance.toFixed(3),
              offers: poi.id === 'starbucks_downtown' ? ['10% off coffee'] : [],
              timestamp: Date.now()
            }
          });
          
          // Update last entry time
          await db.set(lastLocationKey, { timestamp: Date.now() }, 60); // 1 hour TTL
        }
      } else if (distance <= 1.0) {
        // Nearby but not in geofence
        nearbyPOIs.push({
          poiId: poi.id,
          poiName: poi.name,
          distance: distance
        });
      }
    }
    
    // Store user's current location
    await db.set(`current_location:${userId}`, {
      latitude: userLat,
      longitude: userLon,
      timestamp: Date.now(),
      nearbyPOIs: nearbyPOIs.length,
      geofenceHits: geofenceAlerts.length
    }, 1440); // 24 hours TTL
    
    // Publish location analytics
    await pubnub.fire({
      channel: 'analytics.location',
      message: {
        userId: userId,
        coordinates: { lat: userLat, lon: userLon },
        nearbyPOIs: nearbyPOIs.length,
        geofenceAlerts: geofenceAlerts.length,
        timestamp: Date.now()
      }
    });
    
    // Add geofencing results to message
    request.message.geofencing = {
      alerts: geofenceAlerts,
      nearbyPOIs: nearbyPOIs,
      processedAt: Date.now()
    };
    
    return request.ok();
  } catch (error) {
    console.error('Location processing error:', error);
    return request.abort();
  }
};
```

### Example 2: Delivery Route Optimization

```javascript
export default async (request) => {
  const advancedMath = require("advanced_math");
  const db = require("kvstore");
  const pubnub = require("pubnub");
  
  try {
    const deliveryRequest = request.message;
    const driverLat = deliveryRequest.driver.latitude;
    const driverLon = deliveryRequest.driver.longitude;
    const driverId = deliveryRequest.driver.id;
    
    // Get pending deliveries from KV store
    const pendingDeliveriesKey = `pending_deliveries:${driverId}`;
    const pendingDeliveries = await db.get(pendingDeliveriesKey) || [];
    
    // Add new delivery to pending list
    if (deliveryRequest.newDelivery) {
      pendingDeliveries.push(deliveryRequest.newDelivery);
    }
    
    // Calculate distances to all pending deliveries
    const deliveriesWithDistance = pendingDeliveries.map(delivery => {
      const distance = advancedMath.getDistance(
        driverLat, driverLon,
        delivery.latitude, delivery.longitude
      );
      
      return {
        ...delivery,
        distance: distance,
        estimatedTime: Math.ceil(distance * 2) // Rough estimate: 2 minutes per mile
      };
    });
    
    // Sort by distance (nearest first)
    deliveriesWithDistance.sort((a, b) => a.distance - b.distance);
    
    // Calculate total route distance
    let totalDistance = 0;
    let currentLat = driverLat;
    let currentLon = driverLon;
    
    const optimizedRoute = deliveriesWithDistance.map((delivery, index) => {
      const segmentDistance = advancedMath.getDistance(
        currentLat, currentLon,
        delivery.latitude, delivery.longitude
      );
      
      totalDistance += segmentDistance;
      currentLat = delivery.latitude;
      currentLon = delivery.longitude;
      
      return {
        deliveryId: delivery.id,
        address: delivery.address,
        coordinates: { lat: delivery.latitude, lon: delivery.longitude },
        distance: delivery.distance,
        segmentDistance: segmentDistance,
        cumulativeDistance: totalDistance,
        estimatedArrival: new Date(Date.now() + (totalDistance * 2 * 60000)).toISOString(), // 2 min/mile
        priority: delivery.priority || 'normal',
        order: index + 1
      };
    });
    
    // Calculate route efficiency metrics
    const directDistances = deliveriesWithDistance.map(d => d.distance);
    const totalDirectDistance = directDistances.reduce((sum, dist) => sum + dist, 0);
    const routeEfficiency = totalDirectDistance > 0 ? (totalDirectDistance / totalDistance) * 100 : 100;
    
    // Update pending deliveries in KV store
    await db.set(pendingDeliveriesKey, pendingDeliveries, 480); // 8 hours TTL
    
    // Store optimized route
    await db.set(`route:${driverId}`, {
      route: optimizedRoute,
      totalDistance: totalDistance,
      efficiency: routeEfficiency,
      estimatedDuration: totalDistance * 2, // minutes
      createdAt: Date.now()
    }, 480); // 8 hours TTL
    
    // Publish route update to driver
    await pubnub.publish({
      channel: `driver.${driverId}.route`,
      message: {
        type: 'route_optimized',
        deliveryCount: optimizedRoute.length,
        totalDistance: totalDistance.toFixed(2),
        efficiency: routeEfficiency.toFixed(1),
        estimatedDuration: `${Math.ceil(totalDistance * 2)} minutes`,
        route: optimizedRoute
      }
    });
    
    // Publish to fleet management
    await pubnub.fire({
      channel: 'fleet.analytics',
      message: {
        driverId: driverId,
        routeOptimized: true,
        deliveryCount: optimizedRoute.length,
        totalDistance: totalDistance,
        efficiency: routeEfficiency,
        timestamp: Date.now()
      }
    });
    
    // Add route optimization results to message
    request.message.routeOptimization = {
      optimized: true,
      deliveryCount: optimizedRoute.length,
      totalDistance: totalDistance,
      efficiency: routeEfficiency,
      estimatedDuration: totalDistance * 2
    };
    
    return request.ok();
  } catch (error) {
    console.error('Route optimization error:', error);
    return request.abort();
  }
};
```

### Example 3: Asset Tracking and Proximity Monitoring

```javascript
export default async (request) => {
  const advancedMath = require("advanced_math");
  const pubnub = require("pubnub");
  const db = require("kvstore");
  
  try {
    const assetUpdate = request.message;
    const assetId = assetUpdate.assetId;
    const assetLat = assetUpdate.latitude;
    const assetLon = assetUpdate.longitude;
    const assetType = assetUpdate.type || 'unknown';
    
    // Store current asset location
    const locationKey = `asset_location:${assetId}`;
    const previousLocation = await db.get(locationKey);
    
    await db.set(locationKey, {
      latitude: assetLat,
      longitude: assetLon,
      type: assetType,
      lastUpdate: Date.now()
    }, 1440); // 24 hours TTL
    
    // Calculate movement if previous location exists
    let movementDistance = 0;
    let movementSpeed = 0; // mph
    
    if (previousLocation) {
      movementDistance = advancedMath.getDistance(
        previousLocation.latitude, previousLocation.longitude,
        assetLat, assetLon
      );
      
      const timeDiff = (Date.now() - previousLocation.lastUpdate) / 1000 / 3600; // hours
      if (timeDiff > 0) {
        movementSpeed = movementDistance / timeDiff;
      }
    }
    
    // Get all other assets for proximity checking
    const allAssetKeys = await db.getKeys();
    const assetLocationKeys = allAssetKeys.keys.filter(key => 
      key.startsWith('asset_location:') && key !== locationKey
    );
    
    const proximityAlerts = [];
    const nearbyAssets = [];
    
    // Check proximity to other assets
    for (const otherAssetKey of assetLocationKeys) {
      const otherAsset = await db.get(otherAssetKey);
      if (otherAsset) {
        const distance = advancedMath.getDistance(
          assetLat, assetLon,
          otherAsset.latitude, otherAsset.longitude
        );
        
        const otherAssetId = otherAssetKey.replace('asset_location:', '');
        
        // Proximity alert thresholds based on asset type
        const proximityThresholds = {
          'vehicle': 0.1,    // 0.1 miles
          'equipment': 0.05, // 0.05 miles
          'personnel': 0.02, // 0.02 miles
          'unknown': 0.1
        };
        
        const threshold = proximityThresholds[assetType] || 0.1;
        
        if (distance <= threshold) {
          proximityAlerts.push({
            assetId: otherAssetId,
            assetType: otherAsset.type,
            distance: distance,
            alert: 'proximity_breach'
          });
          
          // Send proximity alert
          await pubnub.publish({
            channel: 'assets.proximity_alerts',
            message: {
              primaryAsset: assetId,
              secondaryAsset: otherAssetId,
              distance: distance.toFixed(4),
              threshold: threshold,
              timestamp: Date.now()
            }
          });
        } else if (distance <= 1.0) {
          // Track nearby assets (within 1 mile)
          nearbyAssets.push({
            assetId: otherAssetId,
            assetType: otherAsset.type,
            distance: distance
          });
        }
      }
    }
    
    // Check geofence boundaries
    const geofences = [
      { id: 'warehouse_1', lat: 40.7580, lon: -73.9855, radius: 0.5, type: 'safe_zone' },
      { id: 'restricted_area', lat: 40.7489, lon: -73.9680, radius: 0.2, type: 'restricted' },
      { id: 'depot', lat: 40.7505, lon: -73.9934, radius: 0.3, type: 'safe_zone' }
    ];
    
    const geofenceStatus = [];
    
    for (const geofence of geofences) {
      const distance = advancedMath.getDistance(assetLat, assetLon, geofence.lat, geofence.lon);
      
      if (distance <= geofence.radius) {
        geofenceStatus.push({
          geofenceId: geofence.id,
          type: geofence.type,
          status: 'inside',
          distance: distance
        });
        
        // Alert for restricted areas
        if (geofence.type === 'restricted') {
          await pubnub.publish({
            channel: 'assets.security_alerts',
            message: {
              assetId: assetId,
              alertType: 'restricted_area_entry',
              geofence: geofence.id,
              distance: distance.toFixed(4),
              timestamp: Date.now()
            }
          });
        }
      }
    }
    
    // Track asset movement patterns
    if (movementDistance > 0.1) { // Only track significant movements
      await db.incrCounter(`asset_movements:${assetId}`);
      
      // Alert for excessive speed
      if (movementSpeed > 60) { // 60 mph threshold
        await pubnub.publish({
          channel: 'assets.speed_alerts',
          message: {
            assetId: assetId,
            speed: movementSpeed.toFixed(2),
            distance: movementDistance.toFixed(3),
            threshold: 60,
            timestamp: Date.now()
          }
        });
      }
    }
    
    // Publish comprehensive tracking update
    await pubnub.fire({
      channel: 'assets.tracking',
      message: {
        assetId: assetId,
        coordinates: { lat: assetLat, lon: assetLon },
        movement: {
          distance: movementDistance,
          speed: movementSpeed
        },
        proximity: {
          alerts: proximityAlerts.length,
          nearbyAssets: nearbyAssets.length
        },
        geofences: geofenceStatus,
        timestamp: Date.now()
      }
    });
    
    // Add tracking results to message
    request.message.tracking = {
      movementDistance: movementDistance,
      movementSpeed: movementSpeed,
      proximityAlerts: proximityAlerts.length,
      nearbyAssets: nearbyAssets.length,
      geofenceStatus: geofenceStatus.length,
      processedAt: Date.now()
    };
    
    return request.ok();
  } catch (error) {
    console.error('Asset tracking error:', error);
    return request.abort();
  }
};
```

### Example 4: Ride-Sharing and Transportation

```javascript
export default async (request, response) => {
  const advancedMath = require("advanced_math");
  const db = require("kvstore");
  const utils = require("utils");
  
  try {
    const action = request.params.action;
    
    switch (action) {
      case 'find_drivers':
        const passengerLat = parseFloat(request.query.lat);
        const passengerLon = parseFloat(request.query.lon);
        const maxDistance = parseFloat(request.query.maxDistance) || 5.0; // Default 5 miles
        
        if (!passengerLat || !passengerLon) {
          return response.send({ error: 'Latitude and longitude required' }, 400);
        }
        
        // Get all available drivers
        const driverKeys = await db.getKeys();
        const availableDriverKeys = driverKeys.keys.filter(key => 
          key.startsWith('driver_location:')
        );
        
        const nearbyDrivers = [];
        
        for (const driverKey of availableDriverKeys) {
          const driverData = await db.get(driverKey);
          if (driverData && driverData.available) {
            const distance = advancedMath.getDistance(
              passengerLat, passengerLon,
              driverData.latitude, driverData.longitude
            );
            
            if (distance <= maxDistance) {
              const driverId = driverKey.replace('driver_location:', '');
              
              // Calculate estimated arrival time (assuming 30 mph average speed in city)
              const estimatedMinutes = Math.ceil(distance * 2); // 2 minutes per mile
              
              nearbyDrivers.push({
                driverId: driverId,
                distance: distance,
                coordinates: {
                  lat: driverData.latitude,
                  lon: driverData.longitude
                },
                estimatedArrival: estimatedMinutes,
                rating: driverData.rating || 4.5,
                vehicleType: driverData.vehicleType || 'standard'
              });
            }
          }
        }
        
        // Sort by distance (closest first)
        nearbyDrivers.sort((a, b) => a.distance - b.distance);
        
        // Limit to top 10 drivers
        const topDrivers = nearbyDrivers.slice(0, 10);
        
        return response.send({
          passengerLocation: { lat: passengerLat, lon: passengerLon },
          searchRadius: maxDistance,
          driversFound: topDrivers.length,
          drivers: topDrivers.map(driver => ({
            ...driver,
            distance: parseFloat(driver.distance.toFixed(2))
          }))
        }, 200);
        
      case 'calculate_fare':
        const pickupLat = parseFloat(request.query.pickupLat);
        const pickupLon = parseFloat(request.query.pickupLon);
        const dropoffLat = parseFloat(request.query.dropoffLat);
        const dropoffLon = parseFloat(request.query.dropoffLon);
        const serviceType = request.query.serviceType || 'standard';
        
        if (!pickupLat || !pickupLon || !dropoffLat || !dropoffLon) {
          return response.send({ error: 'Pickup and dropoff coordinates required' }, 400);
        }
        
        const tripDistance = advancedMath.getDistance(
          pickupLat, pickupLon, dropoffLat, dropoffLon
        );
        
        // Fare calculation based on service type
        const fareRates = {
          standard: { base: 2.50, perMile: 1.75, perMinute: 0.25 },
          premium: { base: 5.00, perMile: 3.50, perMinute: 0.45 },
          shared: { base: 1.50, perMile: 1.25, perMinute: 0.15 }
        };
        
        const rates = fareRates[serviceType] || fareRates.standard;
        
        // Estimate trip duration (assuming 25 mph average with traffic)
        const estimatedDuration = (tripDistance / 25) * 60; // minutes
        
        const baseFare = rates.base;
        const distanceFare = tripDistance * rates.perMile;
        const timeFare = estimatedDuration * rates.perMinute;
        const subtotal = baseFare + distanceFare + timeFare;
        
        // Add surge pricing during peak hours
        const currentHour = new Date().getHours();
        const isPeakHour = (currentHour >= 7 && currentHour <= 9) || (currentHour >= 17 && currentHour <= 19);
        const surgeMultiplier = isPeakHour ? 1.5 : 1.0;
        
        const surgeAmount = (subtotal * surgeMultiplier) - subtotal;
        const beforeTax = subtotal + surgeAmount;
        const tax = beforeTax * 0.08; // 8% tax
        const totalFare = beforeTax + tax;
        
        return response.send({
          trip: {
            pickup: { lat: pickupLat, lon: pickupLon },
            dropoff: { lat: dropoffLat, lon: dropoffLon },
            distance: parseFloat(tripDistance.toFixed(2)),
            estimatedDuration: Math.ceil(estimatedDuration)
          },
          fare: {
            serviceType: serviceType,
            baseFare: parseFloat(baseFare.toFixed(2)),
            distanceFare: parseFloat(distanceFare.toFixed(2)),
            timeFare: parseFloat(timeFare.toFixed(2)),
            subtotal: parseFloat(subtotal.toFixed(2)),
            surgeMultiplier: surgeMultiplier,
            surgeAmount: parseFloat(surgeAmount.toFixed(2)),
            tax: parseFloat(tax.toFixed(2)),
            total: parseFloat(totalFare.toFixed(2))
          },
          conditions: {
            isPeakHour: isPeakHour,
            surgeActive: surgeMultiplier > 1.0
          }
        }, 200);
        
      case 'track_trip':
        const tripId = request.query.tripId;
        const currentLat = parseFloat(request.query.lat);
        const currentLon = parseFloat(request.query.lon);
        
        if (!tripId || !currentLat || !currentLon) {
          return response.send({ error: 'Trip ID and current coordinates required' }, 400);
        }
        
        // Get trip details
        const tripKey = `trip:${tripId}`;
        const tripData = await db.get(tripKey);
        
        if (!tripData) {
          return response.send({ error: 'Trip not found' }, 404);
        }
        
        // Calculate distances
        const distanceToPickup = advancedMath.getDistance(
          currentLat, currentLon,
          tripData.pickup.lat, tripData.pickup.lon
        );
        
        const distanceToDropoff = advancedMath.getDistance(
          currentLat, currentLon,
          tripData.dropoff.lat, tripData.dropoff.lon
        );
        
        const tripProgress = advancedMath.getDistance(
          tripData.pickup.lat, tripData.pickup.lon,
          currentLat, currentLon
        );
        
        const totalTripDistance = advancedMath.getDistance(
          tripData.pickup.lat, tripData.pickup.lon,
          tripData.dropoff.lat, tripData.dropoff.lon
        );
        
        const progressPercentage = totalTripDistance > 0 ? 
          Math.min((tripProgress / totalTripDistance) * 100, 100) : 0;
        
        // Determine trip status
        let status = 'en_route_to_pickup';
        if (distanceToPickup < 0.1) {
          status = 'at_pickup';
        } else if (progressPercentage > 5) {
          status = 'en_route_to_dropoff';
        }
        
        if (distanceToDropoff < 0.1 && progressPercentage > 80) {
          status = 'arriving_at_dropoff';
        }
        
        // Update trip status
        tripData.currentLocation = { lat: currentLat, lon: currentLon };
        tripData.status = status;
        tripData.progress = progressPercentage;
        tripData.lastUpdate = Date.now();
        
        await db.set(tripKey, tripData, 240); // 4 hours TTL
        
        return response.send({
          tripId: tripId,
          status: status,
          currentLocation: { lat: currentLat, lon: currentLon },
          progress: parseFloat(progressPercentage.toFixed(1)),
          distances: {
            toPickup: parseFloat(distanceToPickup.toFixed(3)),
            toDropoff: parseFloat(distanceToDropoff.toFixed(3)),
            totalTrip: parseFloat(totalTripDistance.toFixed(2)),
            completed: parseFloat(tripProgress.toFixed(2))
          },
          estimatedArrival: Math.ceil(distanceToDropoff * 2) // 2 minutes per mile
        }, 200);
        
      default:
        return response.send({ error: 'Invalid action' }, 400);
    }
  } catch (error) {
    console.error('Transportation service error:', error);
    return response.send({ error: 'Internal server error' }, 500);
  }
};
```

### Example 5: Weather and Environmental Monitoring

```javascript
export default async (request) => {
  const advancedMath = require("advanced_math");
  const pubnub = require("pubnub");
  const db = require("kvstore");
  const xhr = require("xhr");
  
  try {
    const sensorData = request.message;
    const sensorLat = sensorData.latitude;
    const sensorLon = sensorData.longitude;
    const sensorId = sensorData.sensorId;
    const temperature = sensorData.temperature;
    const humidity = sensorData.humidity;
    const windSpeed = sensorData.windSpeed;
    
    // Get all weather stations for regional analysis
    const stationKeys = await db.getKeys();
    const weatherStationKeys = stationKeys.keys.filter(key => 
      key.startsWith('weather_station:')
    );
    
    const nearbyStations = [];
    const regionalData = {
      temperatures: [temperature],
      humidities: [humidity],
      windSpeeds: [windSpeed]
    };
    
    // Find nearby weather stations (within 50 miles)
    for (const stationKey of weatherStationKeys) {
      if (stationKey === `weather_station:${sensorId}`) continue;
      
      const stationData = await db.get(stationKey);
      if (stationData) {
        const distance = advancedMath.getDistance(
          sensorLat, sensorLon,
          stationData.latitude, stationData.longitude
        );
        
        if (distance <= 50) {
          nearbyStations.push({
            stationId: stationKey.replace('weather_station:', ''),
            distance: distance,
            data: stationData
          });
          
          // Add to regional data for analysis
          if (stationData.temperature !== undefined) {
            regionalData.temperatures.push(stationData.temperature);
          }
          if (stationData.humidity !== undefined) {
            regionalData.humidities.push(stationData.humidity);
          }
          if (stationData.windSpeed !== undefined) {
            regionalData.windSpeeds.push(stationData.windSpeed);
          }
        }
      }
    }
    
    // Sort nearby stations by distance
    nearbyStations.sort((a, b) => a.distance - b.distance);
    
    // Calculate regional averages
    const regionalStats = {
      avgTemperature: regionalData.temperatures.reduce((sum, temp) => sum + temp, 0) / regionalData.temperatures.length,
      avgHumidity: regionalData.humidities.reduce((sum, hum) => sum + hum, 0) / regionalData.humidities.length,
      avgWindSpeed: regionalData.windSpeeds.reduce((sum, wind) => sum + wind, 0) / regionalData.windSpeeds.length,
      stationCount: nearbyStations.length + 1
    };
    
    // Detect anomalies compared to regional data
    const anomalies = [];
    
    if (Math.abs(temperature - regionalStats.avgTemperature) > 10) {
      anomalies.push({
        type: 'temperature',
        value: temperature,
        regional: regionalStats.avgTemperature,
        variance: Math.abs(temperature - regionalStats.avgTemperature)
      });
    }
    
    if (Math.abs(humidity - regionalStats.avgHumidity) > 20) {
      anomalies.push({
        type: 'humidity',
        value: humidity,
        regional: regionalStats.avgHumidity,
        variance: Math.abs(humidity - regionalStats.avgHumidity)
      });
    }
    
    if (Math.abs(windSpeed - regionalStats.avgWindSpeed) > 15) {
      anomalies.push({
        type: 'wind_speed',
        value: windSpeed,
        regional: regionalStats.avgWindSpeed,
        variance: Math.abs(windSpeed - regionalStats.avgWindSpeed)
      });
    }
    
    // Check for severe weather conditions
    const alerts = [];
    
    if (temperature > 100 || temperature < -10) {
      alerts.push({
        type: 'extreme_temperature',
        severity: temperature > 110 || temperature < -20 ? 'critical' : 'warning',
        value: temperature
      });
    }
    
    if (windSpeed > 40) {
      alerts.push({
        type: 'high_wind',
        severity: windSpeed > 60 ? 'critical' : 'warning',
        value: windSpeed
      });
    }
    
    if (humidity > 95) {
      alerts.push({
        type: 'extreme_humidity',
        severity: 'warning',
        value: humidity
      });
    }
    
    // Store current sensor data
    await db.set(`weather_station:${sensorId}`, {
      latitude: sensorLat,
      longitude: sensorLon,
      temperature: temperature,
      humidity: humidity,
      windSpeed: windSpeed,
      lastUpdate: Date.now(),
      anomalies: anomalies.length,
      alerts: alerts.length
    }, 240); // 4 hours TTL
    
    // Publish alerts if any
    if (alerts.length > 0) {
      await pubnub.publish({
        channel: 'weather.alerts',
        message: {
          sensorId: sensorId,
          location: { lat: sensorLat, lon: sensorLon },
          alerts: alerts,
          regionalContext: {
            nearbyStations: nearbyStations.length,
            avgTemperature: regionalStats.avgTemperature.toFixed(1),
            avgWindSpeed: regionalStats.avgWindSpeed.toFixed(1)
          },
          timestamp: Date.now()
        }
      });
    }
    
    // Publish anomalies for analysis
    if (anomalies.length > 0) {
      await pubnub.fire({
        channel: 'weather.anomalies',
        message: {
          sensorId: sensorId,
          location: { lat: sensorLat, lon: sensorLon },
          anomalies: anomalies,
          regionalStats: regionalStats,
          nearbyStations: nearbyStations.slice(0, 5), // Top 5 closest
          timestamp: Date.now()
        }
      });
    }
    
    // Publish regional weather summary
    await pubnub.fire({
      channel: 'weather.regional',
      message: {
        centerPoint: { lat: sensorLat, lon: sensorLon },
        radius: 50,
        statistics: {
          ...regionalStats,
          avgTemperature: parseFloat(regionalStats.avgTemperature.toFixed(1)),
          avgHumidity: parseFloat(regionalStats.avgHumidity.toFixed(1)),
          avgWindSpeed: parseFloat(regionalStats.avgWindSpeed.toFixed(1))
        },
        conditions: {
          anomalies: anomalies.length,
          alerts: alerts.length,
          stationsReporting: regionalStats.stationCount
        },
        timestamp: Date.now()
      }
    });
    
    // Add analysis results to message
    request.message.analysis = {
      regional: {
        stationsNearby: nearbyStations.length,
        avgTemperature: parseFloat(regionalStats.avgTemperature.toFixed(1)),
        avgHumidity: parseFloat(regionalStats.avgHumidity.toFixed(1)),
        avgWindSpeed: parseFloat(regionalStats.avgWindSpeed.toFixed(1))
      },
      anomalies: anomalies.length,
      alerts: alerts.length,
      processedAt: Date.now()
    };
    
    return request.ok();
  } catch (error) {
    console.error('Weather monitoring error:', error);
    return request.abort();
  }
};
```

## Helper Functions and Advanced Usage

### Converting Miles to Kilometers

Since `getDistance()` returns miles, you might need to convert to kilometers:

```javascript
function milesToKilometers(miles) {
  return miles * 1.60934;
}

function kilometersToMiles(kilometers) {
  return kilometers / 1.60934;
}

// Usage
const advancedMath = require("advanced_math");
const distanceMiles = advancedMath.getDistance(lat1, lon1, lat2, lon2);
const distanceKm = milesToKilometers(distanceMiles);
console.log(`Distance: ${distanceMiles.toFixed(2)} miles / ${distanceKm.toFixed(2)} km`);
```

### Creating Circular Geofences

```javascript
function isWithinCircularGeofence(pointLat, pointLon, centerLat, centerLon, radiusMiles) {
  const advancedMath = require("advanced_math");
  const distance = advancedMath.getDistance(pointLat, pointLon, centerLat, centerLon);
  return distance <= radiusMiles;
}

// Usage
const insideGeofence = isWithinCircularGeofence(
  userLat, userLon,    // User's location
  storeLat, storeLon,  // Store's location
  0.5                  // 0.5 mile radius
);
```

### Calculating Bearing Between Points

```javascript
function calculateBearing(lat1, lon1, lat2, lon2) {
  const advancedMath = require("advanced_math");
  
  const dLon = advancedMath.deg2rad(lon2 - lon1);
  const lat1Rad = advancedMath.deg2rad(lat1);
  const lat2Rad = advancedMath.deg2rad(lat2);
  
  const y = Math.sin(dLon) * Math.cos(lat2Rad);
  const x = Math.cos(lat1Rad) * Math.sin(lat2Rad) - 
            Math.sin(lat1Rad) * Math.cos(lat2Rad) * Math.cos(dLon);
  
  const bearing = Math.atan2(y, x);
  return (bearing * 180 / Math.PI + 360) % 360; // Convert to degrees and normalize
}

// Usage
const bearing = calculateBearing(startLat, startLon, endLat, endLon);
console.log(`Heading: ${bearing.toFixed(1)}° (0=North, 90=East, 180=South, 270=West)`);
```

## Use Cases and Applications

### Location Services
- **Geofencing:** Create virtual boundaries and detect entry/exit
- **Proximity Detection:** Find nearby points of interest or users
- **Distance Calculations:** Measure distances for delivery, travel, or service areas
- **Location-Based Notifications:** Send alerts based on user location

### Transportation and Logistics
- **Route Optimization:** Calculate shortest distances for delivery routes
- **Fleet Management:** Track vehicle locations and monitor movement
- **Ride-Sharing:** Match drivers with passengers based on proximity
- **Shipping Calculations:** Determine delivery costs based on distance

### Real Estate and Mapping
- **Property Search:** Find properties within a specific distance of amenities
- **Commute Analysis:** Calculate distances to schools, work, shopping
- **Market Analysis:** Analyze property values based on location
- **Service Area Definition:** Define coverage areas for businesses

### Emergency Services
- **Response Optimization:** Find nearest emergency responders
- **Evacuation Planning:** Calculate safe distances from hazards
- **Resource Allocation:** Deploy resources based on geographic need
- **Alert Systems:** Notify users within affected areas

## Limits and Considerations

*   **Accuracy:** The Haversine formula used by `getDistance()` assumes a spherical Earth, which provides good accuracy for most applications but may have slight variations for very precise measurements.
*   **Performance:** Distance calculations are computationally efficient but consider the number of calculations when processing large datasets.
*   **Coordinate Validation:** Always validate that latitude values are between -90 and 90, and longitude values are between -180 and 180.
*   **Unit Consistency:** Remember that `getDistance()` returns miles. Convert to other units as needed.
*   **Floating Point Precision:** Be aware of floating-point precision when comparing distances or performing calculations.

## Best Practices

*   **Validate coordinates** before performing calculations to avoid errors.
*   **Cache distance calculations** in the KV store for frequently used location pairs.
*   **Use appropriate precision** when displaying distances to users (e.g., 2 decimal places for miles).
*   **Consider Earth's curvature** for very long distances where spherical geometry matters more.
*   **Implement reasonable thresholds** for geofencing and proximity detection.
*   **Handle edge cases** like identical coordinates (zero distance) gracefully.
*   **Combine with other modules** like the KV store for location caching and PubNub module for real-time location updates.
*   **Use batch processing** when calculating distances for many points to optimize performance.
*   **Store location data efficiently** using meaningful key structures in the KV store.