angular.module("emails-editor", []);
angular.module("app", ["emails-editor"]);
var App;
(function (App) {
    "use strict";
    var MainCtrl = (function () {
        function MainCtrl($scope, service) {
            this.$scope = $scope;
            this.service = service;
            $scope.title = "MainCtrl";
            $scope.controller = this;
        }
        MainCtrl.prototype.getEmailsCount = function () {
            alert(this.service.getEmails().length);
        };
        MainCtrl.prototype.addEmails = function () {
            this.service.generateEmail();
        };
        MainCtrl.id = "mainCtrl";
        MainCtrl.$inject = ["$scope", "emailsEditorService"];
        return MainCtrl;
    }());
    angular.module("app").controller("mainCtrl", MainCtrl);
})(App || (App = {}));
var EmailsEditor;
(function (EmailsEditor) {
    var Email = (function () {
        function Email(email) {
            this.email = email;
        }
        Object.defineProperty(Email.prototype, "email", {
            get: function () {
                return this._email;
            },
            set: function (value) {
                this._email = value;
                this._isCorrect = EmailsEditor.Helper.checkEmail(value);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Email.prototype, "isCorrect", {
            get: function () {
                return this._isCorrect;
            },
            enumerable: true,
            configurable: true
        });
        return Email;
    }());
    EmailsEditor.Email = Email;
})(EmailsEditor || (EmailsEditor = {}));
var EmailsEditor;
(function (EmailsEditor) {
    "use strict";
    var KeyCodes;
    (function (KeyCodes) {
        KeyCodes[KeyCodes["Enter"] = 13] = "Enter";
        KeyCodes[KeyCodes["Comma"] = 44] = "Comma";
    })(KeyCodes || (KeyCodes = {}));
    var EmailsEditorCtrl = (function () {
        function EmailsEditorCtrl($scope, service) {
            this.$scope = $scope;
            this.service = service;
            $scope.title = "";
            $scope.emails = service.getEmails();
            $scope.frmData = {
                inEmail: ""
            };
            $scope.controller = this;
        }
        Object.defineProperty(EmailsEditorCtrl.prototype, "emails", {
            get: function () {
                return this.$scope.emails;
            },
            enumerable: true,
            configurable: true
        });
        EmailsEditorCtrl.prototype.deleteEmail = function (email) {
            this.service.deleteEmail(email);
        };
        EmailsEditorCtrl.prototype.keyPressHandler = function (event) {
            switch (event.keyCode) {
                case KeyCodes.Comma:
                case KeyCodes.Enter:
                    this.leaveFocusHandler();
                    event.preventDefault();
                    break;
            }
        };
        EmailsEditorCtrl.prototype.leaveFocusHandler = function () {
            this.addEmail(this.$scope.frmData.inEmail);
        };
        EmailsEditorCtrl.prototype.pasteHandler = function (event) {
            var _this = this;
            var email = event.clipboardData.items[0];
            email.getAsString(function (data) {
                _this.addEmail(data);
                _this.$scope.$apply();
            });
        };
        EmailsEditorCtrl.prototype.addEmail = function (email) {
            if (email) {
                this.service.addEmail(email);
            }
            this.$scope.frmData.inEmail = "";
        };
        EmailsEditorCtrl.id = "emailsEditorCtrl";
        EmailsEditorCtrl.$inject = ["$scope", "emailsEditorService"];
        return EmailsEditorCtrl;
    }());
    EmailsEditor.EmailsEditorCtrl = EmailsEditorCtrl;
    angular.module("emails-editor").controller("emailsEditorCtrl", EmailsEditorCtrl);
})(EmailsEditor || (EmailsEditor = {}));
var EmailsEditor;
(function (EmailsEditor) {
    "use strict";
    var EmailsEditorDirective = (function () {
        function EmailsEditorDirective() {
            this.restrict = "E";
            this.templateUrl = "EmailsEditor\\DirectievesTemplates\\EmailsEditorDirectiveTemplate.html";
            this.controller = "emailsEditorCtrl";
            this.scope = {
                title: "@myTitle"
            };
        }
        EmailsEditorDirective.prototype.link = function (scope, element, attrs) {
        };
        EmailsEditorDirective.instance = function ($window) {
            return new EmailsEditorDirective();
        };
        EmailsEditorDirective.$inject = ["$window"];
        return EmailsEditorDirective;
    }());
    angular.module("emails-editor").directive("emailsEditor", EmailsEditorDirective.instance);
})(EmailsEditor || (EmailsEditor = {}));
var EmailsEditor;
(function (EmailsEditor) {
    "use strict";
    var EmailsEditorService = (function () {
        function EmailsEditorService($http) {
            this.$http = $http;
            this._emails = [];
        }
        EmailsEditorService.prototype.getEmails = function () {
            return this._emails;
        };
        EmailsEditorService.prototype.findemail = function (email) {
            for (var i = 0, len = this._emails.length; i < len; i++) {
                if (this._emails[i].email === email) {
                    return i;
                }
            }
            return -1;
        };
        EmailsEditorService.prototype.addEmail = function (email) {
            var index = this.findemail(email);
            if (index === -1) {
                this._emails.push(new EmailsEditor.Email(email));
            }
        };
        EmailsEditorService.prototype.deleteEmail = function (email) {
            var index = this.findemail(email);
            if (index > -1) {
                this._emails.splice(index, 1);
            }
        };
        EmailsEditorService.prototype.generateEmail = function () {
            var _this = this;
            this.$http.get("https://randomuser.me/api/", { responseType: "json" }).success(function (data) {
                _this.addEmail(data.results[0].email);
            });
        };
        EmailsEditorService.id = "emailsEditorService";
        EmailsEditorService.$inject = ["$http"];
        return EmailsEditorService;
    }());
    EmailsEditor.EmailsEditorService = EmailsEditorService;
    angular.module("emails-editor").service("emailsEditorService", EmailsEditorService);
})(EmailsEditor || (EmailsEditor = {}));
var EmailsEditor;
(function (EmailsEditor) {
    var Helper = (function () {
        function Helper() {
        }
        Helper.checkEmail = function (email) {
            return this._emailRegex.test(email);
        };
        Helper._emailRegex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        return Helper;
    }());
    EmailsEditor.Helper = Helper;
})(EmailsEditor || (EmailsEditor = {}));
//# sourceMappingURL=app.js.map