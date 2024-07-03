import { Fetcher } from "swr";

export class Fetchers {
  static GET: Fetcher<any, string> = (url) =>
    fetch(`${process.env.NEXT_PUBLIC_API_URL}${url}`).then((r) => r.json());
  static POST: Fetcher<any, [string, object]> = ([url, body]) =>
    fetch(`${process.env.NEXT_PUBLIC_API_URL}${url}`, {
      method: "POST",
      body: JSON.stringify(body),
    }).then((r) => r.json());
  static PUT: Fetcher<any, [string, object]> = ([url, body]: [
    string,
    Object
  ]) =>
    fetch(`${process.env.NEXT_PUBLIC_API_URL}${url}`, {
      method: "PUT",
      body: JSON.stringify(body),
    }).then((r) => r.json());
}
