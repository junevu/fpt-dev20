window.UI18N = (function () {
    this.langCode = "vi-VN";
    this.dictionary = {
        "vi-VN": {
            home: "Trang chủ",
            category: "Danh mục",
            login: "Đăng nhập",
            logout: "Đăng xuất",
            deleteAll: "Xóa tất cả",
            food: "Món ăn",
            favorite: "Yêu thích",
            removeFavorite: "Bỏ thích",
            viewLocations: "Xem các địa điểm",
            searchPlaceholder: "Tìm kiếm tên món ăn, địa phương, vùng miền...",
            viewMore: "Xem thêm",
            northernSpecialties: "Đặc sản miền Bắc",
            centralSpecialties: "Đặc sản miền Trung",
            southernSpecialties: "Đặc sản miền Nam",
            introduce: "Giới thiệu",
            region: "Miền",
            north: "Miền Bắc",
            central: "Miền Trung",
            south: "Miền Nam",
            near: "Địa điểm gần bạn",
            distance: "Cách vị trí của bạn",
            direction: "Chỉ đường",
            directionFrom: "Chỉ đường từ",
            notCalcDistance: "Không thể tính khoảng cách",
            to: "đến",
            address: "Địa chỉ",
            yourLocation: "Vị trí của bạn",
            startLocation: "Vị trí bắt đầu",
            uid: "Tài khoản",
            pwd: "Mật khẩu",
            register: "Đăng ký",
            remember: "Nhớ mật khẩu",
            forgotPass: "Lấy lại mật khẩu",
            loginSocial: "Đăng nhập vơi mạng xã hôi",
            videoOnYoutube: "Video về món ăn này",
            uidValidation: "Bạn chưa nhập tên tài khoản !",
            pwdValidation: "Bạn chưa nhập mật khẩu !",
            accountValidation: "Tài khoản hoặc mật khẩu không chính xác !"
        },
        "en-US": {
            home: "Home",
            category: "Category",
            login: "Login",
            logout: "Logout",
            deleteAll: "Delete All",
            food: "Food",
            favorite: "Favorite",
            removeFavorite: "Remove Favorite",
            viewLocations: "View Locations",
            searchPlaceholder: "Search for food, local, regional names...",
            viewMore: "View more",
            northernSpecialties: "Northern Specialties",
            centralSpecialties: "Central Specialties",
            southernSpecialties: "Southern Specialties",
            introduce: "Introduction",
            region: "Region",
            north: "North",
            central: "Central",
            south: "South",
            near: "Locations near you",
            distance: "from your location",
            direction: "Direction",
            directionFrom: "Direction from",
            notCalcDistance: "Cannot calculate distance",
            to: "to",
            address: "Address",
            yourLocation: "Your location",
            startLocation: "Start location",
            uid: "Username",
            pwd: "Password",
            register: "Register",
            remember: "Remember",
            forgotPass: "Forgot password",
            loginSocial: "Login with social",
            videoOnYoutube: "Video about this food",
            uidValidation: "You have not entered an account name !",
            pwdValidation: "You have not entered a password !",
            accountValidation: "Account or password is incorrect !"
        },
    };

    this.setLocalization = function (langCode) {
        if (this.dictionary.hasOwnProperty(langCode)) {
            this.langCode = langCode;
            localStorage.setItem("lang", langCode);
            $("a[langCode]").map(function(){
                if(this.getAttribute("langCode") == langCode){
                    this.classList.add("active");
                }else{
                    this.classList.remove("active");
                }
            });
            return true;
        } else {
            return false;
        }
    }

    this.getString = function (key) {
        return this.dictionary[langCode][key];
    }

    this.translate = function () {
        $("[i18n-key]").map(function () {
            let key = this.getAttribute("i18n-key");
            this.innerText = UI18N.getString(key);
        });

        $("[i18n-key-placeholder]").map(function(){
            let key = this.getAttribute("i18n-key-placeholder");
            this.placeholder = UI18N.getString(key);
        });

        $("[i18n-key-title]").map(function(){
            let key = this.getAttribute("i18n-key-title");
            this.title = UI18N.getString(key);
        });
    }

    return this;
})();

var lang = localStorage.getItem("lang");
if(lang !== null){
    UI18N.setLocalization(lang);
}else{
    UI18N.setLocalization("vi-VN");
}

UI18N.translate();

$("a[langCode]").on('click', function () {
    let langCode = this.getAttribute("langCode");
    UI18N.setLocalization(langCode);
    UI18N.translate();
});