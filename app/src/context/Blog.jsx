import { Program, AnchorProvider } from "@project-serum/anchor";
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import { Keypair, PublicKey, SystemProgram } from "@solana/web3.js";
import {
  createContext,
  FC,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { getPostById } from "src/context/functions/getPostById";
import { getPosts } from "src/context/functions/getPosts";
import { getUser } from "src/context/functions/getUser";
import { initBlog } from "src/context/functions/initBlog";
import { getAvatarUrl } from "src/functions/getAvatarUrl";
import { getRandomName } from "src/functions/getRandomName";
import idl from "src/idl.json";

const PROGRAM_KEY = new PublicKey(idl.metadata.address);
let key = localStorage.getItem("publicKey");
let currentKey = key || "11111111111111111111111111111111";
const BLOG_KEY = new PublicKey(currentKey.toString());
// create unique user key
export const getUserKey = (walletKey) => {
  const userAccount = Keypair.fromSeed(
    new TextEncoder().encode(
      `${PROGRAM_KEY.toString().slice(0, 15)}__${walletKey
        .toString()
        .slice(0, 15)}`
    )
  );

  return userAccount;
};

function getProgram(provider) {
  return new Program(idl, PROGRAM_KEY, provider);
}

const BlogContext = createContext({
  user: undefined,
  posts: [],
  createPost: async () => undefined,
  fetchUser: async () => undefined,
});

export const useBlog = () => {
  const context = useContext(BlogContext);
  if (!context) {
    throw new Error("Parent must be wrapped inside PostsProvider");
  }

  return context;
};

export const BlogProvider = ({ children }) => {
  const [user, setUser] = useState();
  const [blogkey, setBlogKey] = useState(
    new PublicKey("11111111111111111111111111111111")
  );
  const [posts, setPosts] = useState([]);
  const [provider, setProvider] = useState();

  const wallet = useAnchorWallet();
  const { connection } = useConnection();

  const signupUser = useCallback(

  );

  const fetchUser = useCallback(async () => {
    if (provider) {
      const program = getProgram(provider);
      const user = await getUser(program, provider.wallet.publicKey);

      if (!user) {
        const name = getRandomName();
        const avatar = getAvatarUrl(name);
        await signupUser({ name, avatar });
        const user = await getUser(program, provider.wallet.publicKey);

        setUser(user);
      } else {
        setUser({id: 'BrbvsSoA8puuJPARUmHNqDpJigTRvjomnRCCFVTfFe5G', name: 'Lawnce', avatar: 'https://gravatar.com/avatar/1234?s=400&d=robohash&r=x'});
      }
    }
  }, [provider, signupUser]);

  const createPost = useCallback(
  );

  // set provider
  useEffect(() => {
    if (wallet) {
      const provider = new AnchorProvider(connection, wallet, {});
      setProvider(provider);
    }
  }, [connection, wallet]);

  // set initial posts
  useEffect(() => {
    let POST_EVENT_LISTENER;

    async function start() {
      if (provider) {
        const program = getProgram(provider);
        console.log(blogkey);
        const blog = await initBlog(
          program,
          BLOG_KEY,
          provider.wallet.publicKey,
          setBlogKey
        );
        console.log(blog);
        // initially load all the posts
        const [observer] = getPosts({
          program,
          fromPostId: blog.currentPostKey.toString(),
        });

        console.log(posts)

        observer.subscribe({
          next(post) {
            setPosts((posts) => [...posts, post]);

          },
          complete() {
            // listen create/update/delete post events,
            // after fetching all posts
  
            POST_EVENT_LISTENER = program.addEventListener(
              "PostEvent",
              async (event) => {
                const postId = event?.postId?.toString();
                const nextPostId = event?.nextPostId?.toString();

                if (postId) {
                  switch (event.label) {
                    case "CREATE":
                      const post = await getPostById(postId, program);

                      if (post) {
                        setPosts((posts) => [post, ...posts]);
                      }
                      break;

                    default:
                      break;
                  }
                }
              }
            );
          },
        });
      }
    }

    // function getStaticPosts() {
    //   setPosts(
    //     [
    //       {
    //         id: "abc",
    //         prePostId: "xyz",
    //         title:"Welcome to the App",
    //         content:"This is static text",
    //         userId: "1234",
    //       }
    //     ]
    //   )
    // }
    // getStaticPosts()
    // start();
    return () => {
      if (provider && POST_EVENT_LISTENER) {
        const program = getProgram(provider);

        program.removeEventListener(POST_EVENT_LISTENER).catch((e) => {
          console.log("error: ", e.message);
        });
      }
    };
  }, [provider]);
  console.log(posts,"PART TWO")
  return (
    <BlogContext.Provider
      value={{
        user,
        posts,
        createPost,
        fetchUser,
      }}
    >
      {children}
    </BlogContext.Provider>
  );
};
