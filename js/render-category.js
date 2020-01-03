var data = [];
var currentPage = 1;
var currentIndex = 0;
var still;

var url = new URL(window.location.href);
var id = url.searchParams.get("id")

switch (id) {
    case 'mien-bac':
        $("#category-name").text(UI18N.getString("northernSpecialties")).attr("i18n-key", "northernSpecialties");;
        renderFoods("Bắc");
        break;
    case 'mien-trung':
        $("#category-name").text(UI18N.getString("centralSpecialties")).attr("i18n-key", "centralSpecialties");;
        renderFoods("Trung");
        break;
    case 'mien-nam':
        $("#category-name").text(UI18N.getString("southernSpecialties")).attr("i18n-key", "southernSpecialties");
        renderFoods("Nam");
        break;
    default:
        location.href = "/";
        break;
}

/*-------------------------------------
    Render Food List Function
    -------------------------------------*/
function renderFoods(mien) {
    readTextFile("/data/monan.json", function (text) {

        db.monan = JSON.parse(text);

        db.monan.sort(function (a, b) {
            return b.diem - a.diem;
        });

        db.monan.forEach(function (item, i) {
            if (item.mien == mien) {
                item.index = i;
                data.push(item);
            }
        });

        still = data.length;

        for (let i = currentIndex; i < currentPage * limitItem && i < data.length; i++) {
            let food = data[currentIndex];

            //Render Card Food Item
            let root = document.createElement("div");
            let el = FoodCard(food, food.index);
            ReactDOM.render(el, root);
            root = root.firstChild;
            $(root.querySelector('.starrr')).starrr({
                rating: Math.floor(food.diem / 2)
            });
            root.querySelector('.btn-like').addEventListener('click', function () {
                checkLike(this);
            });
            $("#food-container").append(root);

            currentIndex++;
            still--;
        }

        $("#view-more").text(`${UI18N.getString("viewMore")} (${still} ${UI18N.getString("food")})`);
        $("#food-container .preload").remove();
    });
}

$("#view-more").click(function () {
    currentPage++;

    for (let i = currentIndex; i < currentPage * limitItem && i < data.length; i++) {
        let food = data[currentIndex];

        //Render Card Food Item
        let root = document.createElement("div");
        let el = FoodCard(food, food.index);
        ReactDOM.render(el, root);
        root = root.firstChild;
        $(root.querySelector('.starrr')).starrr({
            rating: Math.floor(food.diem / 2)
        });
        root.querySelector('.btn-like').addEventListener('click', function () {
            checkLike(this);
        });
        $("#food-container").append(root);

        currentIndex++;
        still--;
    }

    $("#view-more").text(`${UI18N.getString("viewMore")} (${still} ${UI18N.getString("food")})`);
});