interface IMessage {
  store: "drafts";
  task: "add" | "remove" | "get" | "getAll" | "edit";
  data: any;
}

interface IComment {
  id: number;
  url: string;
  text: string;
  signature: string;
  date: Date;

  author: {
    id: number;
    name: string;
  }
}

interface IDraft {
  id: number;
  url: string;
  text: string;
  date: Date;
}
