var url_string = window.location.href;

var url = new URL(url_string);
var index = url.searchParams.get("id");


/*-------------------------------------
    Read data from file
    -------------------------------------*/
readTextFile("/data/monan.json", function (text) {

    db.monan = JSON.parse(text);

    db.monan.sort(function (a, b) {
        return b.diem - a.diem;
    });

    var food = db.monan[index];

    $("#food-wrapper .preload").remove();
    //Render food
    let e = document.createElement("div");

    let item = LargeCard(food, index);
    ReactDOM.render(item, e);
    $(e.querySelector('.starrr')).starrr({
        rating: Math.floor(food.diem / 2)
    });
    e.querySelector('.btn-like').addEventListener('click', function () {
        checkLike(this);
    });
    e = e.firstChild;

    $("#food-wrapper").prepend(e);

    if (UI18N.langCode == "vi-VN") {
        $("#food-intro").html(food.mota);
    } else {
        ggTranslate(food.mota, "vi", "en").then(function (res) {
            $("#food-intro").html(res.data.translations[0].translatedText);
        });
    }

    var q = "hướng+dẫn+làm+" + food.ten.replace(/\s/g, '+');

    var url = "https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=3&q=" + q + "&type=video&order=viewCount&key=AIzaSyCbwBAV56FOq0VV47Sb5ey0pQN_8dsbPzQ";

    $.getJSON(url, function (data) {

        data.items.forEach(video => {
            let e = document.createElement("div");
            e.classList.add("col-12", "col-md-9", "mb-5");

            let item = YTPlayer(video.id.videoId);
            ReactDOM.render(item, e);
            $("#yt-video-container").append(e);
        });
    })
});

$("a[langCode]").click(function () {
    if (UI18N.langCode == "vi-VN") {
        ggTranslate($("#food-intro").html(), "en", "vi").then(function (res) {
            $("#food-intro").html(res.data.translations[0].translatedText);
        });
    } else {
        ggTranslate($("#food-intro").html(), "vi", "en").then(function (res) {
            $("#food-intro").html(res.data.translations[0].translatedText);
        });
    }
});

/*-------------------------------------
    Define YT Player Component
    -------------------------------------*/
function YTPlayer(videoId) {
    var src = "https://www.youtube.com/embed/" + videoId + "?autoplay=0";
    return (
        <div class="card shadow rounded o-hidden p-2">
            <iframe type="text/html" width="100%" height="360" src={src} frameborder="0"></iframe>
        </div >
    );
}

/*-------------------------------------
    Define Card Item Component
    -------------------------------------*/
function LargeCard(data, index) {

    let style = {
        "background-image": "url(" + data.hinhanh + ")"
    };

    let likeBtn = (
        <li>
            <a className="btn-like" data-id={data.id} index={index} liked="false" >
                <i className="far fa-heart"></i>
                <span i18n-key="favorite">{UI18N.getString("favorite")}</span>
            </a>
        </li>
    );

    fav.forEach(function (item, i) {
        if (item.id === data.id) {
            likeBtn = (
                <li>
                    <a className="btn-like text-danger" data-id={data.id} index={index} liked="true">
                        <i className="fas fa-heart"></i>
                        <span i18n-key="removeFavorite">{UI18N.getString("removeFavorite")}</span>
                    </a>
                </li>
            );
        }
    });

    let mien = "north";
    if (data.mien == "Trung") {
        mien = "central";
    } else if (data.mien == "Nam") {
        mien = "south";
    }

    return (
        <div className="col-12">
            <div className="product-box-layout1">
                <div className="item-figure">
                    <div className="photo" style={style}></div>
                    <a href={"/mon-an.html?id=" + index} className="item-dot">
                        <span></span>
                        <span></span>
                        <span></span>
                    </a>
                </div>
                <div className="item-content">
                    <div>
                        <span className="sub-title d-inline mr-2" i18n-key="food">{UI18N.getString("food")}</span>
                        <span className="badge badge-success mr-2">{data.diadanh}
                        </span><span className="badge badge-secondary" i18n-key={mien}>{UI18N.getString(mien)}</span>
                    </div>
                    <h3 className="item-title"><a href={"/mon-an.html?id=" + index}>{data.ten}</a></h3>
                    <div className="item-rating">
                        <span class='starrr'></span>
                        <span>{data.diem}<span> / 10</span></span>
                    </div>

                    <ul className="entry-meta">
                        <li>
                            <a onClick={(e) => showLocaions(index)}>
                                <i className="fas fa-map-marker-alt"></i>
                                <span i18n-key="viewLocations">{UI18N.getString("viewLocations")}</span>
                            </a>
                        </li>
                        {likeBtn}
                    </ul>

                    <hr className="my-5" />

                    <div className="intro-area">
                        <h3 i18n-key="introduce">{UI18N.getString("introduce")}</h3>
                        <div id="food-intro" class="text-justify px-3 px-md-5"></div>
                    </div>

                    <hr className="my-5" />

                    <div className="video-area mb-5">
                        <h3 i18n-key="videoOnYoutube">{UI18N.getString("videoOnYoutube")}</h3>
                        <div id="yt-video-container" className="row d-flex justify-content-center px-4"></div>
                    </div>

                </div>
            </div>
        </div>
    );

}
