var db = {};
var fav = [];
var limitItem = 6;
var auth = false;

var directionsService;
var directionsDisplay;

renderAcountArea();

/*-------------------------------------
    Read data from local storage
    -------------------------------------*/
let favLocal = localStorage.getItem("fav");

if (favLocal) {
    favLocal = JSON.parse(favLocal);
    fav = favLocal;
    renderFav();
}

/*-------------------------------------
    Define Card Item component
    -------------------------------------*/
function FoodCard(data, index) {

    let style = {
        "background-image": "url(" + data.hinhanh + ")"
    };

    let likeBtn = (<li>
        <a className="btn-like" data-id={data.id} index={index} liked="false" >
            <i className="far fa-heart"></i>
            <span i18n-key="favorite">{UI18N.getString("favorite")}</span>
        </a>
    </li>);

    fav.forEach(function (item, i) {
        if (item.id === data.id) {
            likeBtn = <li>
                <a className="btn-like text-danger" data-id={data.id} index={index} liked="true">
                    <i className="fas fa-heart"></i>
                    <span i18n-key="removeFavorite">{UI18N.getString("removeFavorite")}</span>
                </a>
            </li>;
        }
    });

    let mien = "north";
    if (data.mien == "Trung") {
        mien = "central";
    } else if (data.mien == "Nam") {
        mien = "south";
    }

    return (
        <div className="col-lg-4 col-md-6 col-sm-12 select-disable">
            <div className="product-box-layout4">
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
                </div>
            </div>
        </div>
    );

}

/*-------------------------------------
    Render Favorite Function
    -------------------------------------*/
function renderFav() {
    if (fav) {

        $(".fav .count-fav").text(fav.length);

        $(".fav-items .wrapper .fav-item").remove();

        fav.forEach(function (value, i) {
            let root = document.createElement("div");

            let elm = FavItem(value, i);
            ReactDOM.render(elm, root);

            $(".fav .fav-items .wrapper").prepend(root.firstChild);
        });

    }
}

/*-------------------------------------
Render Modal Show Locations Function
-------------------------------------*/
function showLocaions(index) {

    $("#modal-locations .modal-body .row").empty();

    db.monan[index].diadiem.forEach(function (item) {

        renderLocaItem(item);

    });

    getLocation(function (pos) {
        var origin = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);

        $("#modal-locations .row .addr").map(function (i, item) {

            var request = {
                origin: origin,
                destination: item.innerText,
                travelMode: 'DRIVING'
            };

            directionsService.route(request, function (res, status) {

                if (status == "OK") {
                    let text = "";
                    if (UI18N.langCode == "vi-VN") {
                        text = `${UI18N.getString("distance")} ${res.routes[0].legs[0].distance.text}`;
                    } else {
                        text = `${res.routes[0].legs[0].distance.text} ${UI18N.getString("distance")}`;
                    }
                    $("#modal-locations .location .distance:eq(" + i + ")").text(text);
                } else {
                    $("#modal-locations .location .distance:eq(" + i + ")").text(UI18N.getString("notCalcDistance"));
                    $("#modal-locations .location .btn:eq(" + i + ")").attr('disabled', 'disabled');
                }

            });
        });

    });

    $("#modal-locations").modal("show");

}


function setRating(value) {
    alert('new rating is ' + value)
}

/*-------------------------------------
Render Locations Function
-------------------------------------*/
function renderLocaItem(loca) {
    let root = document.createElement("div");
    let el = LocaItem(loca);
    ReactDOM.render(el, root);
    $(root.querySelector(".starrr")).starrr({
        rating: loca.diem
    });

    $("#modal-locations .modal-body .row").append(root.firstChild);
}

/*-------------------------------------
Define Location Item
-------------------------------------*/
function LocaItem(data) {
    return (
        <div className="col-6">
            <div className="jumbotron location">
                <h4 className="text-uppercase">{data.ten}</h4>
                <div className="item-rating">
                    <span className='starrr mr-2'></span>
                    <span><span className="text-dark">{data.diem}</span><span className="text-black-50"> / 10</span></span>
                </div>
                <div className="badge badge-md badge-warning distance"></div>
                <button className="btn btn-secondary" onClick={() => { direction(data.ten, data.diachi) }}>
                    <i className="fas fa-directions mr-2"></i>
                    <span i18n-key="direction">{UI18N.getString("direction")}</span>
                </button>
                <div><i className="fas fa-map-marker-alt mr-2"></i><span className="addr">{data.diachi}</span></div>
            </div>
        </div>
    );
}

/*-------------------------------------
Google Map Direction Function
-------------------------------------*/
function direction(name, addr) {

    var direct = function () {
        let start = $("#modal-map #input-origin").val().trim();
        calcRoute(start, addr, function (gg) {
            ReactDOM.render(
                <div>
                    <h3 className="mb-1">
                        {UI18N.getString("directionFrom")}
                        <span className="badge badge-secondary mx-2 text-uppercase">{start}</span>
                        {UI18N.getString("to")}
                        <span className="badge badge-secondary mx-2 text-uppercase">{name}</span>
                        <span className="badge badge-warning">{gg.routes[0].legs[0].distance.text}</span>
                    </h3>

                    <h6 className="m-0">{UI18N.getString("address")}: {addr}</h6>
                </div>,
                $("#modal-map .modal-header .title")[0]
            );
        });
    }

    getLocation(function (pos) {
        var origin = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);

        calcRoute(origin, addr, function (gg) {
            ReactDOM.render(
                <div>
                    <h3 className="mb-1">
                        {UI18N.getString("directionFrom")}
                        <span className="badge badge-secondary mx-2 text-uppercase">{UI18N.getString("yourLocation")}</span>
                        {UI18N.getString("to")}
                        <span className="badge badge-secondary mx-2 text-uppercase">{name}</span>
                        <span className="badge badge-warning">{gg.routes[0].legs[0].distance.text}</span>
                    </h3>

                    <h6 className="m-0">{UI18N.getString("address")}: {addr}</h6>
                </div>,
                $("#modal-map .modal-header .title")[0]
            );


            var root = document.createElement("div");
            ReactDOM.render(
                <div className="input-group mb-3">
                    <input id="input-origin" type="text" className="form-control" placeholder={UI18N.getString("startLocation")} />
                    <div className="input-group-append">
                        <button className="btn btn-outline-primary" onClick={direct}>{UI18N.getString("direction")}</button>
                    </div>
                </div>,
                root
            )

            $("#modal-map .modal-body .input-group").remove();
            $("#modal-map .modal-body").prepend(root.firstChild);

        });

    });

    $("#modal-map").modal("show");

}


/*-------------------------------------
Modal Map Add Event Listener
-------------------------------------*/
$("#modal-map").on("shown.bs.modal", function () {
    $("#modal-locations").modal("hide");
    $("body").addClass("modal-open");
});

$("#modal-map").on("hidden.bs.modal", function () {
    $("#modal-locations").modal("show");
});

/*-------------------------------------
Btn Like Add Event Listener
-------------------------------------*/
$(".fav .fav-btn .item-btn").click(function () {
    fav = [];
    localStorage.setItem("fav", "");
    renderFav();

    var e = $(".btn-like");
    e.removeClass("text-danger");
    e.html('<i class="far fa-heart"></i>Yêu thích');
    e.attr("liked", false);
});

/*-------------------------------------
Check Like Food Function
-------------------------------------*/
function checkLike(e) {

    e = $(e);

    var id = e.attr("data-id");

    var index = e.attr("index");

    var isLiked = JSON.parse(e.attr("liked"));

    e = $("[data-id='" + id + "']");

    if (isLiked) {

        if (fav) {

            fav.forEach(function (item, i) {
                if (item.id == id) {
                    fav.splice(i, 1);

                    e.removeClass("text-danger");
                    e.html(`<i class="far fa-heart"></i>${UI18N.getString("favorite")}`);

                    e.attr("liked", false);
                }
            });

        }

    }
    else {
        let m = db.monan[index];
        m.index = index;

        fav.push(m);

        e.addClass("text-danger");

        e.html(`<i class="fas fa-heart"></i>${UI18N.getString("removeFavorite")}`);

        e.attr("liked", true);
    }

    localStorage.setItem("fav", JSON.stringify(fav));

    renderFav();

}

/*-------------------------------------
UnLike Food Function
-------------------------------------*/
function unLikeFood(id) {

    var e = $("[data-id='" + id + "']");

    var id = e.attr("data-id");

    var index = e.attr("index");

    var isLiked = JSON.parse(e.attr("liked"));

    if (fav) {

        fav.forEach(function (item, i) {
            if (item.id == id) {
                fav.splice(i, 1);

                e.removeClass("text-danger");
                e.html(`<i class="far fa-heart"></i>${UI18N.getString("favorite")}`);

                e.attr("liked", false);
            }
        });

    }

    localStorage.setItem("fav", JSON.stringify(fav));

    renderFav();

}

/*-------------------------------------
    Define Favorite Item component
    -------------------------------------*/
function FavItem(data, index) {

    let style = {
        "background-image": "url(" + data.hinhanh + ")"
    };

    return (
        <div className="fav-item d-fex justify-content-between">
            <div className="d-flex align-items-center">
                <div className="fav-img mr-3">
                    <a href={"/mon-an.html?id=" + data.index}>
                        <div className="photo" style={style}></div>
                    </a>
                </div>
                <div className="fav-title">
                    <a href={"/mon-an.html?id=" + data.index}>{data.ten}</a>
                </div>
            </div>
            <div className="fav-trash">
                <a onClick={(e) => unLikeFood(data.id)}>
                    <i className="fas fa-trash-alt zebra-tooltips" i18n-key-title="removeFavorite" title={UI18N.getString("removeFavorite")}></i>
                </a>
            </div>
        </div>
    );

}

/*-------------------------------------
    Define Init Carousel Function
    -------------------------------------*/
function InitCarousel() {
    if ($.fn.owlCarousel) {
        $('.rc-carousel').each(function () {
            var carousel = $(this),
                loop = carousel.data('loop'),
                items = carousel.data('items'),
                margin = carousel.data('margin'),
                stagePadding = carousel.data('stage-padding'),
                autoplay = carousel.data('autoplay'),
                autoplayTimeout = carousel.data('autoplay-timeout'),
                smartSpeed = carousel.data('smart-speed'),
                dots = carousel.data('dots'),
                nav = carousel.data('nav'),
                navSpeed = carousel.data('nav-speed'),
                rXsmall = carousel.data('r-x-small'),
                rXsmallNav = carousel.data('r-x-small-nav'),
                rXsmallDots = carousel.data('r-x-small-dots'),
                rXmedium = carousel.data('r-x-medium'),
                rXmediumNav = carousel.data('r-x-medium-nav'),
                rXmediumDots = carousel.data('r-x-medium-dots'),
                rSmall = carousel.data('r-small'),
                rSmallNav = carousel.data('r-small-nav'),
                rSmallDots = carousel.data('r-small-dots'),
                rMedium = carousel.data('r-medium'),
                rMediumNav = carousel.data('r-medium-nav'),
                rMediumDots = carousel.data('r-medium-dots'),
                rLarge = carousel.data('r-large'),
                rLargeNav = carousel.data('r-large-nav'),
                rLargeDots = carousel.data('r-large-dots'),
                rExtraLarge = carousel.data('r-extra-large'),
                rExtraLargeNav = carousel.data('r-extra-large-nav'),
                rExtraLargeDots = carousel.data('r-extra-large-dots'),
                center = carousel.data('center'),
                custom_nav = carousel.data('custom-nav') || '';
            carousel.addClass('owl-carousel');
            var owl = carousel.owlCarousel({
                loop: (loop ? true : false),
                items: (items ? items : 4),
                lazyLoad: true,
                margin: (margin ? margin : 0),
                autoplay: (autoplay ? true : false),
                autoplayTimeout: (autoplayTimeout ? autoplayTimeout : 1000),
                smartSpeed: (smartSpeed ? smartSpeed : 250),
                dots: (dots ? true : false),
                nav: (nav ? true : false),
                navText: ['<i class="flaticon-back" aria-hidden="true"></i>', '<i class="flaticon-next" aria-hidden="true"></i>'],
                navSpeed: (navSpeed ? true : false),
                center: (center ? true : false),
                responsiveClass: true,
                responsive: {
                    0: {
                        items: (rXsmall ? rXsmall : 1),
                        nav: (rXsmallNav ? true : false),
                        dots: (rXsmallDots ? true : false)
                    },
                    576: {
                        items: (rXmedium ? rXmedium : 2),
                        nav: (rXmediumNav ? true : false),
                        dots: (rXmediumDots ? true : false)
                    },
                    768: {
                        items: (rSmall ? rSmall : 3),
                        nav: (rSmallNav ? true : false),
                        dots: (rSmallDots ? true : false)
                    },
                    992: {
                        items: (rMedium ? rMedium : 4),
                        nav: (rMediumNav ? true : false),
                        dots: (rMediumDots ? true : false)
                    },
                    1200: {
                        items: (rLarge ? rLarge : 5),
                        nav: (rLargeNav ? true : false),
                        dots: (rLargeDots ? true : false)
                    },
                    1400: {
                        items: (rExtraLarge ? rExtraLarge : 6),
                        nav: (rExtraLargeNav ? true : false),
                        dots: (rExtraLargeDots ? true : false)
                    }
                }
            });
            if (custom_nav) {
                var nav = $(custom_nav),
                    nav_next = $('.rt-next', nav),
                    nav_prev = $('.rt-prev', nav);

                nav_next.on('click', function (e) {
                    e.preventDefault();
                    owl.trigger('next.owl.carousel');
                    return false;
                });

                nav_prev.on('click', function (e) {
                    e.preventDefault();
                    owl.trigger('prev.owl.carousel');
                    return false;
                });
            }
        });
    }
}

/*-------------------------------------
Define Set Cookie Function
-------------------------------------*/
function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}


/*-------------------------------------
Define Get Cookie Function
-------------------------------------*/
function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

/*-------------------------------------
Define Login Function
-------------------------------------*/
function login(event) {
    event.preventDefault();

    var uid = $("#modal-login #uid").val().trim();
    var pwd = $("#modal-login #pwd").val().trim();
    var remember = $("#modal-login #remember").prop('checked');

    readTextFile("/data/users.json", function (text) {
        db.users = JSON.parse(text);

        if (uid == "") {
            $("#modal-login #validation").text(UI18N.getString("uidValidation"));
            return;
        } else if (pwd == "") {
            $("#modal-login #validation").text(UI18N.getString("pwdValidation"));
            return;
        } else {
            var user = db.users.find(item => item.uid == uid && item.pwd == pwd);

            if (user) {
                setCookie("uid", user.uid, 1);
                setCookie("fullname", user.firstName + " " + user.lastName, 1);

                renderAcountArea();

                $("#modal-login").modal("hide");
            } else {
                $("#modal-login #validation").text(UI18N.getString("accountValidation"));
            }
        }

    });
}

/*-------------------------------------
Define Logout Function
-------------------------------------*/
function logout() {
    setCookie("uid", "", -1);
    setCookie("fullname", "", -1);
    renderAcountArea();
}

/*-------------------------------------
Define Update Account Area Function
-------------------------------------*/
function renderAcountArea() {
    var uidLoged = getCookie("uid");
    var fullname = getCookie("fullname");

    if (uidLoged != "") {
        ReactDOM.render(
            <div className="text-white">
                <i className="fas fa-user mr-2"></i><a className="select-disable">{fullname}</a>
                <button className="btn btn-danger ml-3" onClick={logout} i18n-key-title="logout" title={UI18N.getString("logout")}><i className="fas fa-sign-out-alt"></i></button>
            </div>,
            $(".account-area")[0]
        );
    } else {
        ReactDOM.render(
            <button className="btn btn-danger d-flex align-items-center mr-5 mr-md-0"
                data-toggle="modal" data-target="#modal-login">
                <i className="flaticon-profile mr-2"></i> <span i18n-key="login">{UI18N.getString("login")}</span>
            </button>,
            $(".account-area")[0]
        );
    }
}


/*-------------------------------------
Menu fixded
-------------------------------------*/
if ($('header .header-main-menu').length && $('header .header-main-menu').hasClass('header-sticky')) {
    var header_position = $('header .header-main-menu').offset(),
        lastScroll = 100;
    $(window).on('scroll load', function (event) {
        var st = $(this).scrollTop();
        if (st > header_position.top) {
            ($(".header-table").length) ? $('header .header-table').addClass("header-fixed") : $('header .header-main-menu').addClass("header-fixed");
        } else {
            ($(".header-table").length) ? $('header .header-table').removeClass("header-fixed") : $('header .header-main-menu').removeClass("header-fixed");
        }

        lastScroll = st;

        if (st === 0) {
            ($(".header-table").length) ? $('header .header-table').removeClass("header-fixed") : $('header .header-main-menu').removeClass("header-fixed");
        }
    });
}

/*-------------------------------------
Toggle Menu Handler
-------------------------------------*/
$('.toggle-menu').on('click', function () {
    $('#site-menu').slideToggle(500);
    $(this).toggleClass('active');
})

/*-------------------------------------
Search Box Open Handler
-------------------------------------*/
$('a[href="#search"]').on("click", function (event) {
    event.preventDefault();
    var target = $("#search");
    target.addClass("open");
    $("body").addClass("modal-open");
    setTimeout(function () {
        target.find('input').focus();
    }, 600);
    return false;
});


$(".search-form").submit(function(e){
    if(this.querySelector('input').value.trim() == ""){
        return false;
    }
})

/*-------------------------------------
Search Box Close Handler
-------------------------------------*/
$("#search, #search button.close").on("click keyup", function (event) {
    if (
        event.target === this ||
        event.target.className === "close" ||
        event.keyCode === 27
    ) {
        $(this).removeClass("open");
        $("body").removeClass("modal-open");
    }
});


/*-------------------------------------
On Scroll 
-------------------------------------*/
$(window).on('scroll', function () {
    if ($(window).scrollTop() > 700) {
        $('.scrollup').addClass('back-top');
    } else {
        $('.scrollup').removeClass('back-top');
    }
});



/*-------------------------------------
Read text file function
-------------------------------------*/
function readTextFile(file, callback) {
    var rawFile = new XMLHttpRequest();
    rawFile.overrideMimeType("application/json");
    rawFile.open("GET", file, true);
    rawFile.onreadystatechange = function () {
        if (rawFile.readyState === 4 && rawFile.status == "200") {
            callback(rawFile.responseText);
        }
    }
    rawFile.send(null);
}

/*-------------------------------------
Google direction function
-------------------------------------*/
function calcRoute(origin, destination, calback) {

    var request = {
        origin: origin,
        destination: destination,
        travelMode: 'DRIVING'
    };

    directionsService.route(request, function (result, status) {
        if (status == 'OK') {
            directionsDisplay.setDirections(result);
            calback(result);
        }
    });

}

/*-------------------------------------
Get gps position function
-------------------------------------*/
function getLocation(calback) {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(calback);
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}

function like() {
    var debug = /*true ||*/ false;
    var h = document.querySelector('.heart-wrapper');

    function toggleActivate() {
        h.classList.toggle('active');
    }

    if (!debug) {
        h.addEventListener('click', function () {
            toggleActivate();
        }, false);

        // setInterval(toggleActivate,1000);
    } else {
        var elts = Array.prototype.slice.call(h.querySelectorAll(':scope > *'), 0);
        var activated = false;
        var animating = false;
        var count = 0;
        var step = 1000;

        function setAnim(state) {
            elts.forEach(function (elt) {
                elt.style.animationPlayState = state;
            });
        }

        h.addEventListener('click', function () {
            if (animating) return;
            if (count > 27) {
                h.classList.remove('active');
                count = 0;
                return;
            }
            if (!activated) h.classList.add('active') && (activated = true);

            console.log('Step : ' + (++count));
            animating = true;

            setAnim('running');
            setTimeout(function () {
                setAnim('paused');
                animating = false;
            }, step);
        }, false);

        setAnim('paused');
        elts.forEach(function (elt) {
            elt.style.animationDuration = step / 1000 * 27 + 's';
        });
    }
}

/*---------------------------------------
On Click Section Switch
--------------------------------------- */
$('[data-type="section-switch"]').on('click', function () {
    if (location.pathname.replace(/^\//, '') === this.pathname.replace(/^\//, '') && location.hostname === this.hostname) {
        var target = $(this.hash);
        if (target.length > 0) {

            target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
            $('html,body').animate({
                scrollTop: target.offset().top
            }, 1000);
            return false;
        }
    }
});

$('[data-type="scroll-top"]').on('click', function () {
    $("html, body").animate({ scrollTop: 0 }, "slow");
});

function cleanAccents(str) {
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    str = str.replace(/đ/g, "d");
    str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
    str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
    str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
    str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
    str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
    str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
    str = str.replace(/Đ/g, "D");
    str = str.replace(/\s/g, "");
    // Combining Diacritical Marks
    str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // huyền, sắc, hỏi, ngã, nặng 
    str = str.replace(/\u02C6|\u0306|\u031B/g, ""); // mũ â (ê), mũ ă, mũ ơ (ư)

    return str;
}

function ggTranslate(text, source, target) {
    url = "https://www.googleapis.com/language/translate/v2/";
    url += "?key=" + "AIzaSyCbwBAV56FOq0VV47Sb5ey0pQN_8dsbPzQ";
    url += "&q=" + encodeURI(text);

    url += "&target=" + target;
    url += "&source=" + source;

    return $.ajax({
        url: url,
        type: "GET",
        dataType: "json",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json"
        }
    });
}

$(document).on('keydown', function (event) {
    if (event.keyCode == 83 && event.altKey) {
        var target = $("#search");
        target.addClass("open");
        $("body").addClass("modal-open");
        setTimeout(function () {
            target.find('input').focus();
        }, 600);
    }
});

var slice = [].slice;

(function ($, window) {
    var Starrr;
    window.Starrr = Starrr = (function () {
        Starrr.prototype.defaults = {
            rating: void 0,
            max: 5,
            readOnly: false,
            emptyClass: 'far fa-star',
            fullClass: 'fas fa-star',
            change: function (e, value) { }
        };

        function Starrr($el, options) {
            this.options = $.extend({}, this.defaults, options);
            this.$el = $el;
            this.createStars();
            this.syncRating();
            if (this.options.readOnly) {
                return;
            }
            this.$el.on('mouseover.starrr', 'a', (function (_this) {
                return function (e) {
                    return _this.syncRating(_this.getStars().index(e.currentTarget) + 1);
                };
            })(this));
            this.$el.on('mouseout.starrr', (function (_this) {
                return function () {
                    return _this.syncRating();
                };
            })(this));
            this.$el.on('click.starrr', 'a', (function (_this) {
                return function (e) {
                    e.preventDefault();
                    return _this.setRating(_this.getStars().index(e.currentTarget) + 1);
                };
            })(this));
            this.$el.on('starrr:change', this.options.change);
        }

        Starrr.prototype.getStars = function () {
            return this.$el.find('a');
        };

        Starrr.prototype.createStars = function () {
            var j, ref, results;
            results = [];
            for (j = 1, ref = this.options.max; 1 <= ref ? j <= ref : j >= ref; 1 <= ref ? j++ : j--) {
                results.push(this.$el.append("<a />"));
            }
            return results;
        };

        Starrr.prototype.setRating = function (rating) {
            if (this.options.rating === rating) {
                rating = void 0;
            }
            this.options.rating = rating;
            this.syncRating();
            return this.$el.trigger('starrr:change', rating);
        };

        Starrr.prototype.getRating = function () {
            return this.options.rating;
        };

        Starrr.prototype.syncRating = function (rating) {
            var $stars, i, j, ref, results;
            rating || (rating = this.options.rating);
            $stars = this.getStars();
            results = [];
            for (i = j = 1, ref = this.options.max; 1 <= ref ? j <= ref : j >= ref; i = 1 <= ref ? ++j : --j) {
                results.push($stars.eq(i - 1).removeClass(rating >= i ? this.options.emptyClass : this.options.fullClass).addClass(rating >= i ? this.options.fullClass : this.options.emptyClass));
            }
            return results;
        };

        return Starrr;

    })();
    return $.fn.extend({
        starrr: function () {
            var args, option;
            option = arguments[0], args = 2 <= arguments.length ? slice.call(arguments, 1) : [];
            return this.each(function () {
                var data;
                data = $(this).data('starrr');
                if (!data) {
                    $(this).data('starrr', (data = new Starrr($(this), option)));
                }
                if (typeof option === 'string') {
                    return data[option].apply(data, args);
                }
            });
        }
    });
})(window.jQuery, window);