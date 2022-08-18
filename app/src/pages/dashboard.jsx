import { useWallet } from "@solana/wallet-adapter-react"
import { useCallback, useEffect, useState } from "react"
import { Button } from "src/components/Button"
import { InterestingSkeleton } from "src/components/InterestingSkeleton"
import { PostCard } from "src/components/PostCard"
import { PostForm } from "src/components/PostForm"
import { SponsoredSkeleton } from "src/components/SponsoredSkeleton"
import { useBlog } from "src/context/Blog"
import { displayKey } from "src/functions/displayKey"
import { useHistory } from 'react-router-dom'
export const Dashboard = () => {
  const history = useHistory()
  const [connecting, setConnecting] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const { connected, select, publicKey } = useWallet()
  const { user, posts, fetchUser, createPost } = useBlog()

  const [postTitle, setPostTitle] = useState("")
  const [postContent, setPostContent] = useState("")

  const onCreatePost = useCallback(
    async (title, content) => {
      try {
        await createPost({ title, content })
        setPostTitle("")
        setPostContent("")
        setShowModal(false)
      } catch {
        setShowModal(false)
        // show toast message
      }
    },
    [createPost]
  )

  useEffect(() => {
    if (publicKey) {
      fetchUser()
    }
  }, [fetchUser, publicKey])

  useEffect(() => {
    if (user) {
      setConnecting(false)
    }
  }, [user])

  return (
    <div className="dashboard background-color overflow-auto h-screen">
      <header className="fixed z-10 w-full h-14  shadow-md">
        <div className="flex justify-between items-center h-full container">
          <h2 className="text-2xl font-bold">
            <div className="bg-clip-text bg-gradient-to-br from-indigo-300 colorpink"
            >
              Onaki
            </div>
          </h2>
          {connected ? (
            <div className="flex items-center">
              <p className=" font-bold text-sm ml-2 capitalize underlinepink">
                Home
              </p>
              <p className=" font-bold text-sm ml-2 capitalize mr-4 underlinepink">
                Blog
              </p>
              <img
                src={user?.avatar}
                alt="avatar"
                className="w-8 h-8 rounded-full bg-gray-200 shadow ring-2 ring-indigo-400 ring-offset-2 ring-opacity-50"
              />
              <p className=" font-bold text-sm ml-2 capitalize">
                {user?.name}
              </p>
              {/* <Button
                className="ml-3 mr-2"
                onClick={() => {
                  setShowModal(true)
                }}
              >
                Create Post
              </Button> */}
            </div>
          ) : (
            // <Button
            //   loading={connecting}
            //   className="w-28"
            //   onClick={onConnect}
            //   leftIcon={
            //     <svg
            //       xmlns="http://www.w3.org/2000/svg"
            //       className="h-5 w-5 mr-1"
            //       fill="none"
            //       viewBox="0 0 24 24"
            //       stroke="currentColor"
            //     >
            //       <path
            //         strokeLinecap="round"
            //         strokeLinejoin="round"
            //         strokeWidth={2}
            //         d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
            //       />
            //     </svg>
            //   }
            // >
            //   Connect
            // </Button>
            <h1>BUTTON GOES HERE</h1>
          )}
        </div>
      </header>
      <main className="dashboard-main pb-4 container flex relative">
        <div className="pt-3">
          {/* <h1 className="title">The Blog</h1> */}
          <div className="row">

            <article className="best-post">
              <div
                className="best-post-image"
                style={{
                  backgroundImage: `url("https://user-images.githubusercontent.com/62637513/184338364-a14b7272-d1dc-49f3-9f43-3ac37dacbe85.png")`,
                }}
              ></div>
              <div className="best-post-content">
                <div className="best-post-content-cat">December 2, 2021<span className="dot"> </span>Blog</div>
                <div className="best-post-content-title">
                  Lorem ipsum dolor sit amet, consectetur
                </div>
                <div className="best-post-content-sub">
                  Lorem Ipsum, masaüstü yayıncılık ve basın yayın sektöründe
                  kullanılan taklit yazı bloğu olarak tanımlanır. Lipsum,
                  oluşturulacak şablon ve taslaklarda içerik yerine geçerek yazı
                  bloğunu doldurmak için kullanılır.
                </div>
              </div>
            </article>

            <div className="all__posts">
              {posts.map((item) => {
                console.log(item)
                return (
                  <article className="post__card-2"
                    onClick={() => {
                      history.push(`/read-post/${item.id}`)
                    }}
                  >
                    <div className="post__card_-2">
                      <div
                        className="post__card__image-2"
                        style={{
                          backgroundImage: `url("https://user-images.githubusercontent.com/62637513/184338539-9cdbdc58-1e72-4c48-8203-0b7ec23d3eb0.png")`,
                        }}
                      ></div>
                      <div>
                        <div className="post__card_meta-2">
                          <div className="post__card_cat">December 2, 2021<span className="dot"> </span>{item.title} </div>
                          <p className="post__card_alttitle-2">
                            {item.content}
                          </p>
                        </div>
                      </div>
                    </div>
                  </article>
                )
              })}
            </div>
          </div>
        </div>
        <div className={`modal ${showModal && 'show-modal'}`} >
          <div className="modal-content">
            <span className="close-button"
              onClick={() => setShowModal(false)}
            >×</span>
            <PostForm
              postTitle={postTitle}
              postContent={postContent}
              setPostTitle={setPostTitle}
              setPostContent={setPostContent}
              onSubmit={() => onCreatePost(postTitle, postContent)}
            />
          </div>
        </div>
      </main>
    </div>
  )
}
