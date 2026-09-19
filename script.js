/* =========================================================
   RESPONSIVE MENU
   ========================================================= */

function myFunction() {
  var x = document.getElementById("myTopnav");

  x.classList.toggle("responsive");
}


/* =========================================================
   LOAD NAVIGATION
   ========================================================= */

fetch("nav.html")
  .then(function(response) {

    if (!response.ok) {
      throw new Error(
        "Failed to load nav: " + response.status
      );
    }

    return response.text();
  })

  .then(function(navHTML) {

    var placeholder =
      document.getElementById("navbar-placeholder");

    if (placeholder) {
      placeholder.innerHTML = navHTML;
    }

  })

  .catch(function(error) {

    console.error(
      "Error loading navigation:",
      error
    );

  });


/* =========================================================
   SIVON'S THOUGHTS — TUMBLR AND BEARBLOG RSS
   ========================================================= */

const feeds = [
    "https://sivonrapmi.tumblr.com/tagged/sivonsthoughts/rss",
    "https://sivonrapmi.tumblr.com/tagged/sivonsart/rss",
    "https://sivonrapmi.bearblog.dev/feed/?type=rss"
];


const container =
    document.getElementById("tumblr-posts");


/* ==============================
   ESCAPE HTML
   ============================== */

function escapeHTML(text) {

    const div =
        document.createElement("div");

    div.textContent = text || "";

    return div.innerHTML;
}


/* ==============================
   FORMAT DATE
   ============================== */

function formatDate(dateString) {

    const date =
        new Date(dateString);

    return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit"
    });
}


/* ==============================
   RENDER ONE POST
   ============================== */

function renderPost(post) {

    const isBearBlog =
        post.source === "Bear Blog";

    const sourceName =
        isBearBlog
            ? "BEAR BLOG"
            : "TUMBLR";


    /* ==============================
       REMOVE DUPLICATE TUMBLR TITLE
       ============================== */

    let content =
        post.description || "";


    if (!isBearBlog && post.title && content) {

        const temp =
            document.createElement("div");


        temp.innerHTML =
            content;


        const firstHeading =
            temp.querySelector(
                "h1, h2, h3, h4, h5, h6"
            );


        if (
            firstHeading &&
            firstHeading.textContent.trim() ===
            post.title.trim()
        ) {

            firstHeading.remove();

        }


        content =
            temp.innerHTML;
    }


    /* ==============================
       BUILD POST HTML
       ============================== */

    return `
        <article class="tumblr-post ${isBearBlog ? "bearblog-post" : ""}">

            <header class="tumblr-post-header">

                ${
                    isBearBlog && post.title
                    ? `
                        <h3 class="tumblr-post-title">
                            ${escapeHTML(post.title)}
                        </h3>
                    `
                    : ""
                }

                <a
                    href="${escapeHTML(post.link)}"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    ${formatDate(post.pubDate)}
                </a>

            </header>


            <div class="tumblr-post-content">
                ${content}
            </div>


            <footer class="tumblr-post-footer">

                <a
                    href="${escapeHTML(post.link)}"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    VIEW ON ${sourceName}
                </a>

            </footer>

        </article>
    `;
}


/* ==============================
   LOAD ALL FEEDS
   ============================== */

async function loadTumblr() {

    try {

        const feedsData =
            await Promise.all(

                feeds.map(feed => {
                   

                   
                    const rssApi =
                        "https://api.rss2json.com/v1/api.json?rss_url=" +
                        encodeURIComponent(feed);


                    return fetch(rssApi)

                        .then(response => {

                            if (!response.ok) {

                                throw new Error(
                                    "RSS request failed: " +
                                    response.status
                                );

                            }

                            return response.json();

                        })


                        .then(data => {

                            const isBearBlog =
                                feed.includes("bearblog.dev");


                            data.items =
                                data.items.map(post => ({

                                    ...post,

                                    source:
                                        isBearBlog
                                            ? "Bear Blog"
                                            : "Tumblr"

                                }));


                            return data;

                        });

                })

            );


        /* ==============================
           COMBINE POSTS
           ============================== */

        const posts =
            feedsData

                .filter(
                    data =>
                        data.status === "ok"
                )

                .flatMap(
                    data =>
                        data.items
                );


        /* ==============================
           SORT NEWEST FIRST
           ============================== */

        posts.sort(
            (a, b) =>
                new Date(b.pubDate) -
                new Date(a.pubDate)
        );


        /* ==============================
           PUT POSTS INTO HTML
           ============================== */

        container.innerHTML =
            posts
                .map(renderPost)
                .join("");


    } catch (error) {

        console.error(
            "Feed error:",
            error
        );


        container.innerHTML = `
            <p class="tumblr-error">
                COULD NOT LOAD THOUGHTS.
            </p>
        `;
    }
}


/* ==============================
   START
   ============================== */

loadTumblr();


/*=============
TUMBLR RSS END
==============*/
