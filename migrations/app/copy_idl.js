const fs = require("fs");
const blog_idl = require("./target/deploy/blog_sol-keypair.json");

fs.writeFileSync("./app/src/idl.json", JSON.stringify(blog_idl, null, 2));
