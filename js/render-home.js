var currentPage = 1;
var currentIndex = 0;
var still;

readTextFile("/data/monan.json", function (text) {
    Renderer(text);
});

/*-------------------------------------
    Read data from file
    -------------------------------------*/
function Renderer(text, callback) {

    db.monan = JSON.parse(text);

    db.monan.sort(function (a, b) {
        return b.diem - a.diem;
    });


    still = db.monan.length;

    //Render
    for (let i = currentIndex; i < currentPage * limitItem && i < db.monan.length; i++) {
        let food = db.monan[currentIndex];

        $("#slider-top .preload").remove();
        //Render slider
        let root = document.createElement("div");
        let el = SlideItem(food, currentIndex);
        ReactDOM.render(el, root);
        root = root.firstChild;
        $(root.querySelector('.starrr')).starrr({
            rating: Math.floor(food.diem / 2),
            readOnly: !auth,
            change: function (e, value) {
                setRating(value);
            }
        });
        root.querySelector('.btn-like').addEventListener('click', function () {
            checkLike(this);
        });
        $("#slider-top").append(root);

        // Render main section
        $("#recommend .preload").remove();
        root = document.createElement("div");
        el = FoodCard(food, currentIndex);
        ReactDOM.render(el, root);
        root = root.firstChild;
        $(root.querySelector('.starrr')).starrr({
            rating: Math.floor(food.diem / 2)
        });
        root.querySelector('.btn-like').addEventListener('click', function () {
            checkLike(this);
        });
        $("#recommend").append(root);

        currentIndex++;
        still--;
    }

    $("#view-more").text(`${UI18N.getString("viewMore")} (${still} ${UI18N.getString("food")})`);

    // Call Init Carousel Function
    InitCarousel();
    callback;
}

$("#view-more").click(function () {
    currentPage++;

    for (let i = currentIndex; i < currentPage * limitItem && i < db.monan.length; i++) {
        let food = db.monan[currentIndex];
        // Render main section
        let root = document.createElement("div");
        let el = FoodCard(food, currentIndex);
        ReactDOM.render(el, root);
        root = root.firstChild;
        $(root.querySelector('.starrr')).starrr({
            rating: Math.floor(food.diem / 2)
        });
        root.querySelector('.btn-like').addEventListener('click', function () {
            checkLike(this);
        });

        $("#recommend").append(root);
        currentIndex++;
        still--;
    }
    $("#view-more").text(`${UI18N.getString("viewMore")} (${still} ${UI18N.getString("food")})`);
});

/*-------------------------------------
Define Slide Item Component
-------------------------------------*/
function SlideItem(data, index) {

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
        <div className="ranna-slider-content-layout">
            <figure className="item-figure">
                <a href={"/mon-an.html?id=" + index}>
                    <div className="photo" style={style} ></div>
                </a>
            </figure>
            <div className="item-content">
                <div>
                    <span className="sub-title d-inline mr-2" i18n-key="food">{UI18N.getString("food")}</span>
                    <span className="badge badge-success mr-2">{data.diadanh}
                    </span><span className="badge badge-secondary" i18n-key={mien}>{UI18N.getString(mien)}</span>
                </div>
                <h2 className="item-title"><a href={"/mon-an.html?id=" + index}>{data.ten}</a></h2>
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
            </div>
        </div>
    );

}