import { Program } from "@project-serum/anchor";
import { Observable, Subscriber } from "rxjs";

import { getPostById } from "src/context/functions/getPostById";

export function getPosts(args) {
  let sub;

  const cancel = () => sub?.unsubscribe();
  const observer = new Observable((subscriber) => {
    sub = subscriber;

    async function start() {
      const { program, fromPostId } = args;
      let nextPostId= fromPostId;

      while (!!nextPostId) {
        const post = await getPostById(nextPostId, program);
        if (!post) {
          break;
        }

        subscriber.next(post);
        nextPostId = post.prePostId;
      }

      subscriber.complete();
    }

    start();
  });

  return [observer, cancel] ;
}
