angular.module("emails-editor", []);
angular.module("app", ["emails-editor"]);
var App;
(function (App) {
    "use strict";
    var MainCtrl = (function () {
        function MainCtrl($scope, service) {
            this.$scope = $scope;
            this.service = service;
            this.emailContainer = new EmailsEditor.EmailContainer();
        }
        MainCtrl.prototype.getEmailsCount = function () {
            alert(this.emailContainer.emails.length);
        };
        MainCtrl.prototype.addEmails = function () {
            this.service.generateEmail(this.emailContainer);
        };
        MainCtrl.id = "mainCtrl";
        MainCtrl.$inject = ["$scope", "generateEmailsService"];
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
    var EmailContainer = (function () {
        function EmailContainer() {
            this._emails = [];
        }
        Object.defineProperty(EmailContainer.prototype, "emails", {
            get: function () {
                return this._emails;
            },
            enumerable: true,
            configurable: true
        });
        EmailContainer.prototype.findemail = function (email) {
            for (var i = 0, len = this._emails.length; i < len; i++) {
                if (this._emails[i].email === email) {
                    return i;
                }
            }
            return -1;
        };
        EmailContainer.prototype.addEmail = function (email) {
            var index = this.findemail(email);
            if (index === -1) {
                this._emails.push(new EmailsEditor.Email(email));
            }
        };
        EmailContainer.prototype.deleteEmail = function (email) {
            var index = this.findemail(email);
            if (index > -1) {
                this._emails.splice(index, 1);
            }
        };
        return EmailContainer;
    }());
    EmailsEditor.EmailContainer = EmailContainer;
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
        function EmailsEditorCtrl($scope) {
            this.$scope = $scope;
            $scope.frmData = {
                inEmail: ""
            };
            $scope.controller = this;
        }
        Object.defineProperty(EmailsEditorCtrl.prototype, "emailContainer", {
            get: function () {
                return this.$scope.emailContainer;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EmailsEditorCtrl.prototype, "emails", {
            get: function () {
                return this.emailContainer.emails;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EmailsEditorCtrl.prototype, "hasEmails", {
            get: function () {
                return this.emails ? this.emails.length > 0 : false;
            },
            enumerable: true,
            configurable: true
        });
        EmailsEditorCtrl.prototype.deleteEmail = function (email) {
            this.emailContainer.deleteEmail(email);
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
                this.emailContainer.addEmail(email);
            }
            this.$scope.frmData.inEmail = "";
        };
        EmailsEditorCtrl.id = "emailsEditorCtrl";
        EmailsEditorCtrl.$inject = ["$scope"];
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
            this.transclude = true;
            this.replace = true;
            this.restrict = "E";
            this.templateUrl = "app\\emails-editor\\emails-editor.html";
            this.controller = "emailsEditorCtrl";
            this.scope = {
                title: "@header",
                emailContainer: "="
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
var App;
(function (App) {
    "use strict";
    var GenerateEmailsService = (function () {
        function GenerateEmailsService($http) {
            this.$http = $http;
        }
        GenerateEmailsService.prototype.generateEmail = function (container) {
            this.$http.get("https://randomuser.me/api/", { responseType: "json" }).success(function (data) {
                container.addEmail(data.results[0].email);
            });
        };
        GenerateEmailsService.id = "emailsEditorService";
        GenerateEmailsService.$inject = ["$http"];
        return GenerateEmailsService;
    }());
    App.GenerateEmailsService = GenerateEmailsService;
    angular.module("app").service("generateEmailsService", GenerateEmailsService);
})(App || (App = {}));
//# sourceMappingURL=app.js.map