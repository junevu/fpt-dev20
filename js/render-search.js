var url = new URL(location.href);
var txt = url.searchParams.get("q");
var q = cleanAccents(txt.toLowerCase());
var resultCount = 0;
/*-------------------------------------
    Render Search Result
    -------------------------------------*/
readTextFile("/data/monan.json", function (text) {

    db.monan = JSON.parse(text);

    db.monan.sort(function (a, b) {
        return b.diem - a.diem;
    });

    db.monan.forEach(function (food, i) {
        let a = cleanAccents(food.ten.toLowerCase());
        let b = cleanAccents(food.mien.toLowerCase());
        let c = cleanAccents(food.diadanh.toLowerCase());

        if ( a.includes(q) || q.includes(a) || b.includes(q) || q.includes(b) || c.includes(q) || q.includes(c) ) {
            //Render Card Food Item
            let root = document.createElement("div");
            let el = FoodCard(food, i);
            ReactDOM.render(el, root);
            root = root.firstChild;
            $(root.querySelector('.starrr')).starrr({
                rating: Math.floor(food.diem / 2)
            });
            root.querySelector('.btn-like').addEventListener('click', function () {
                checkLike(this);
            });
            $("#search-result").append(root);
            resultCount++;
        }

    });
    $("#search-text").html(`Tìm thấy ${resultCount} kết quả phù hợp với từ khóa: <strong>${txt}</strong>`);
    $("#search-result .preload").remove();
});
