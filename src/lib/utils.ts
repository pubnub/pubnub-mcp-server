export const createResponse = (arg: string, isError: boolean = false) => {
  return {
    content: [
      {
        type: "text" as const,
        text: arg,
      },
    ],
    isError,
  };
};

export const parseError = (e: unknown) => {
  if (e === null || e === undefined) {
    throw new TypeError("parseError expects a non-null value");
  }

  if (
    e &&
    typeof e === "object" &&
    "status" in e &&
    e.status &&
    typeof e.status === "object" &&
    "errorData" in e.status
  ) {
    return {
      name: "PubNubError",
      message: e.status?.errorData,
    };
  }

  if (e instanceof Error) {
    return {
      message: e.message,
      name: e.name,
    };
  }

  let message: string;

  if (typeof e === "object") {
    try {
      message = JSON.stringify(e);
    } catch {
      message = String(e);
    }
  } else {
    message = String(e);
  }

  return {
    message,
    name: "Unknown",
  };
};
