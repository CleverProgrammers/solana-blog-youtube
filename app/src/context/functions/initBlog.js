import { Program } from "@project-serum/anchor";
import { Keypair, PublicKey, SystemProgram } from "@solana/web3.js";

export async function initBlog(program, blogKey, walletKey, setBlogKey) {
  try {
    const blog = await program.account.blogState.fetch(blogKey);
    console.log(blog);
    return blog;
  } catch {
    const blogAccount = Keypair.generate();
    const genesisPostAccount = Keypair.generate();
    await program.rpc.initBlog({
      accounts: {
        authority: walletKey,
        systemProgram: SystemProgram.programId,
        blogAccount: blogAccount.publicKey,
        genesisPostAccount: genesisPostAccount.publicKey,
      },
      signers: [blogAccount, genesisPostAccount],
    });
    const blog = await program.account.blogState.fetch(blogAccount.publicKey);
    let key = new PublicKey(blogAccount.publicKey.toString());
    localStorage.setItem("publicKey", key.toBase58());
    setBlogKey(new PublicKey(blogAccount.publicKey.toString()));
    return blog;
  }
}
