type MessagesTypes = { message?: string }[];

type ResponseTypes = {
  data?: any;
  total?: number;
  messages: MessagesTypes;
};

export default function useFormatResponse() {
  const formatResponse: ResponseTypes = {
    messages: [],
  };

  return {
    get formatResponse() {
      return formatResponse;
    },
    setData(_data: any) {
      formatResponse.data = _data;

      if (Array.isArray(_data)) {
        formatResponse.total = _data.length;
      }
    },
    setMessage(message: string) {
      formatResponse.messages.push({ message: message });
    },
  };
}
