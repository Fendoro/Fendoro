angular.module("emails-editor", []);
angular.module("app", ["emails-editor"]);
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
    var EmailsContainer = (function () {
        function EmailsContainer() {
            this._emails = [];
        }
        Object.defineProperty(EmailsContainer.prototype, "emails", {
            get: function () {
                return this._emails;
            },
            enumerable: true,
            configurable: true
        });
        EmailsContainer.prototype.findEmail = function (email) {
            for (var i = 0, len = this._emails.length; i < len; i++) {
                if (this._emails[i].email === email) {
                    return i;
                }
            }
            return -1;
        };
        EmailsContainer.prototype.addEmail = function (email) {
            var index = this.findEmail(email);
            if (index === -1) {
                this._emails.push(new EmailsEditor.Email(email));
            }
        };
        EmailsContainer.prototype.deleteEmail = function (email) {
            var index = this.findEmail(email);
            if (index > -1) {
                this._emails.splice(index, 1);
            }
        };
        return EmailsContainer;
    }());
    EmailsEditor.EmailsContainer = EmailsContainer;
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
                return this.$scope.emailsContainer;
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
                return this.emails && this.emails.length > 0;
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
var App;
(function (App) {
    "use strict";
    var EmailsCtrl = (function () {
        function EmailsCtrl($scope, service) {
            this.$scope = $scope;
            this.service = service;
            this.emailContainer = new EmailsEditor.EmailsContainer();
        }
        EmailsCtrl.prototype.getEmailsCount = function () {
            alert(this.emailContainer.emails.length);
        };
        EmailsCtrl.prototype.addEmails = function () {
            this.service.generateEmail(this.emailContainer);
        };
        EmailsCtrl.id = "emailsCtrl";
        EmailsCtrl.$inject = ["$scope", "emailsService"];
        return EmailsCtrl;
    }());
    angular.module("app").controller("emailsCtrl", EmailsCtrl);
})(App || (App = {}));
var EmailsEditor;
(function (EmailsEditor) {
    "use strict";
    var EmailsEditorDirective = (function () {
        function EmailsEditorDirective() {
            this.transclude = true;
            this.replace = true;
            this.restrict = "E";
            this.templateUrl = "app/emails-editor/emails-editor.html";
            this.controller = "emailsEditorCtrl";
            this.scope = {
                title: "@header",
                emailsContainer: "="
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
var App;
(function (App) {
    "use strict";
    var EmailsService = (function () {
        function EmailsService($http) {
            this.$http = $http;
        }
        EmailsService.prototype.generateEmail = function (container) {
            this.$http.get("https://randomuser.me/api/", { responseType: "json" }).success(function (data) {
                container.addEmail(data.results[0].email);
            });
        };
        EmailsService.id = "emailsService";
        EmailsService.$inject = ["$http"];
        return EmailsService;
    }());
    App.EmailsService = EmailsService;
    angular.module("app").service("emailsService", EmailsService);
})(App || (App = {}));
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
