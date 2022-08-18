import { Program } from "@project-serum/anchor";
import { PublicKey, SystemProgram } from "@solana/web3.js";

export async function getPostById(postId, program) {
  try {
    const post = await program.account.postState.fetch(new PublicKey(postId));

    const userId = post.user.toString();
    if (userId === SystemProgram.programId.toString()) {
      return;
    }

    return {
      id: postId,
      title: post.title,
      content: post.content,
      userId,
      prePostId: post.prePostKey.toString(),
    };
  } catch (e) {
    console.log(e.message);
  }
}
