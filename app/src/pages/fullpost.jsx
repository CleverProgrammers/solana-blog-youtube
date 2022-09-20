import { AnchorProvider, Program } from "@project-serum/anchor";
import {
  useAnchorWallet,
  useConnection,
} from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPostById } from "src/context/functions/getPostById";
import idl from "src/idl.json";

const PROGRAM_KEY = new PublicKey(idl.metadata.address);

function getProgram(provider) {
  return new Program(idl, PROGRAM_KEY, provider);
}

export const FullPost = () => {
  const { id } = useParams();
  const wallet = useAnchorWallet();
  const { connection } = useConnection();
  const [provider, setProvider] = useState();
  const [post, setPost] = useState();

  useEffect(() => {
    try {
      if (provider) {
        const getPost = async () => {
          const program = getProgram(provider);
          const post = await getPostById(id.toString(), program);
          setPost(post);
        };
        getPost();
      }
    } catch { }
  }, [provider]);

  useEffect(() => {
    if (wallet) {
      const provider = new AnchorProvider(connection, wallet, {});
      setProvider(provider);
    }
  }, [connection, wallet]);


  return (
    <article className="hentry background-color">
      <div className="featured-image">
        <img
          src="https://images.unsplash.com/photo-1531096187418-86ac6b31baea?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=9d6cd4e7c48dfc78f5e9c0fb07b692f0&auto=format&fit=crop&w=1350&q=80"
          alt=""
        />
      </div>
      <h1 className="entry-title">{post?.title}</h1>
      <div className="entry-meta">
        <p>
          <span className="author">
            Written by <a href="#">Lavi Perchik</a>
          </span>{" "}
          <span className="date">Monday, July 9, 2018</span>
        </p>
      </div>
      <div className="entry-content">
        <p>{post?.content}</p>
      </div>
    </article>
  );
};
