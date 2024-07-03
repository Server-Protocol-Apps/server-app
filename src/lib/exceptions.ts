enum ExceptionTypes {
  repo_doesnt_exist = "repo_doesnt_exists",
  no_commits = "no_commits",
}

export interface Exception {
  code: number;
  msg: string;
  payload?: any;
}

export const Exceptions: Record<ExceptionTypes, Exception> = {
  [ExceptionTypes.repo_doesnt_exist]: {
    msg: "This repository does not exist",
    code: 2,
  },
  [ExceptionTypes.no_commits]: {
    msg: "You don't have any commit",
    code: 3,
  },
};

export const isValidException = (object: any): object is Exception => {
  return object && object.code && object.msg;
};
