var fakeElementSelectors = (function () {

    var domParser = new DOMParser();

    var getFakeElement = function (definition) {
        definition.dom = domParser.parseFromString(definition.html, "text/html");

        definition.getElement = function() {
            return definition.dom.querySelector(definition.selector);
        };
        return definition;
    };
    return [
        getFakeElement({
            type: "element with id",
            description: "should get element tag, element id",
            html:
            "<html>" +
            "<body>" +
            "<form>" +
            '<input type="text" id="login" /><br/>' +
            "</form>" +
            "</body>" +
            "</html>",
            selector: "input#login",
            path:"html body form input#login"
        }),
        getFakeElement({
            type: "input with type password",
            description: "should get parent tag, element tag, element type",
            html:
            "<html>" +
            "<body>" +
            "<form>" +
            '<input type="password"/><br/>' +
            "</form>" +
            "</body>" +
            "</html>",
            selector: 'form > input[type="password"]',
            path:"html body form input[type=\"password\"]"
        }),
        getFakeElement({
            type: "input with type submit",
            description: "should get parent tag, element tag, element type",
            html:
            "<html>" +
            "<body>" +
            "<form>" +
            '<input type="submit"/><br/>' +
            "</form>" +
            "</body>" +
            "</html>",
            selector: 'form > input[type="submit"]',
            path:"html body form input[type=\"submit\"]"
        }),
        getFakeElement({
            type: "input with type text",
            description: "should get parent tag, element tag, element type",
            html:
            "<html>" +
            "<body>" +
            "<form>" +
            '<input type="text"/><br/>' +
            "</form>" +
            "</body>" +
            "</html>",
            selector: 'form > input[type="text"]',
            path:"html body form input[type=\"text\"]"
        }),
        getFakeElement({
            type: "input with type email",
            description: "should get parent tag, element tag, element type",
            html:
            "<html>" +
            "<body>" +
            "<form>" +
            '<input type="email"/><br/>' +
            "</form>" +
            "</body>" +
            "</html>"
            ,
            selector: 'form > input[type="email"]',
            path:"html body form input[type=\"email\"]"
        }),
        getFakeElement({
            type: "simple button",
            description: "should get parent tag, element tag",
            html:
            "<html>" +
            "<body>" +
            "<form>" +
            '<button>Click</button><br/>' +
            "</form>" +
            "</body>" +
            "</html>",
            selector: "form > button",
            path:"html body form button"
        }),
        getFakeElement({
            type: "simple img",
            description: "should get parent tag, element tag",
            html:
            "<html>" +
            "<body>" +
            "<form>" +
            '<img/><br/>' +
            "</form>" +
            "</body>" +
            "</html>",
            selector: "form > img",
            path:"html body form img"
        }),
        getFakeElement({
            type: "element a as button",
            description: "should get parent tag, element tag",
            html:
            "<html>" +
            "<body>" +
            "<form>" +
            '<a onclick="logIn()"/><br/>' +
            "</form>" +
            "</body>" +
            "</html>",
            selector: "form > a",
            path:"html body form a"
        }),
        getFakeElement({
            type: "element with className",
            description: "should get parent tag, element tag, element className if other element with same tag",
            html:
            "<html>" +
            "<body>" +
            "<form>" +
            '<button class="btn">Login</button>' +
            '<button class="other-btn">LoginOther</button>' +
            "</form>" +
            "</body>" +
            "</html>",
            selector: "form > button.btn",
            path:"html body form button.btn"
        }),
        getFakeElement({
            type: "element with parent with id",
            description: "should get parent tag, parent id, element tag ",
            html:
            "<html>" +
            "<body>" +
            "<form id='login-form'>" +
            '<button>Login</button>' +
            "</form>" +
            "</body>" +
            "</html>",
            selector: "form#login-form > button",
            path:"html body form#login-form button"
        }),
        getFakeElement({
            type: "element with parent with id",
            description: "should get parent tag, parent id, element tag ",
            html:
            "<html>" +
            "<body>" +
            "<form id='login-form'>" +
            '<button>Login</button>' +
            "</form>" +
            "</body>" +
            "</html>",
            selector: "form#login-form > button",
            path:"html body form#login-form button"
        }),
        getFakeElement({
            type: "element with sublings with same tags",
            description: "should get parent tag, element tag, element number ",
            html:
            "<html>" +
            "<body>" +
            "<form>" +
            '<input type="text" /> <br\>' +
            '<input type="text" /> <br\>' +
            '<input type="text" /> <br\>' +
            "</form>" +
            "</body>" +
            "</html>",
            selector: "form > input[type=\"text\"]:nth-child(1)",
            path:"html body form input[type=\"text\"]"
        }),
        /*         getFakeElement({
         type: "input with name",
         description: "should get parent tag, element tag, element name ",
         html:
         "<form>" +
         '<input type="text" name="first"  /> <br\>' +
         '<input type="text" name="second" /> <br\>' +
         '<input type="text" third="third" /> <br\>' +
         "</form>"+
         "</body>" +
         "</html>",
         selector: "form > input[name=\"first\"]"
         }),*/
        getFakeElement({
            type: "input with id on Russian language",
            description: "should get input with id",
            html:
            "<html>" +
            "<body>" +
            "<form>" +
            '<input type="text" id="логин"  /> <br\>' +
            "</form>" +
            "</body>" +
            "</html>",
            selector: "input#логин",
            path:"html body form input#логин"
        }),
        getFakeElement({
            type: "input with underscore id",
            description: "should get input with id",
            html:
            "<html>" +
            "<body>" +
            "<form>" +
            '<input type="text" id="_login"  /> <br\>' +
            "</form>",
            selector: "input#_login",
            path:"html body form input#_login"
        }),
        getFakeElement({
            type: "input with dash line id",
            description: "should get input with id",
            html:
            "<html>" +
            "<body>" +
            "<form>" +
            '<input type="text" id="login-username"  /> <br\>' +
            "</form>" +
            "</body>" +
            "</html>",
            selector: "input#login-username",
            path:"html body form input#login-username"
        }),
        getFakeElement({
            type: "input with UPPER CASE id",
            description: "should get input with id",
            html:
            "<html>" +
            "<body>" +
            "<form>" +
            '<input type="text" id="LOGIN" /> <br\>' +
            "</form>" +
            "</body>" +
            "</html>",
            selector: "input#LOGIN",
            path:"html body form input#LOGIN"
        }),
        getFakeElement({
            type: "input with number id",
            description: "should get input with id",
            html:
            "<html>" +
            "<body>" +
            "<form>" +
            '<input type="text" id="q1234567"  /> <br\>' +
            "</form>" +
            "</body>" +
            "</html>",
            selector: "input#q1234567",
            path:"html body form input#q1234567"
        }),
        getFakeElement({
            type: "input with ascii char id",
            description: "should get input with id",
            html:
            "<html>" +
            "<body>" +
            "<form>" +
            '<input type="text" id="&#002;test"  /> <br\>' +
            "</form>" +
            "</body>" +
            "</html>",
            selector: "input#\\02 test"
        }),
        getFakeElement({
            type: "input with many same siblings",
            description: "should get parent tag, element tag",
            html:
            "<html>" +
            "<body>" +
            "<form>" +
            '<input type="text" class="first"/> <br\>' +
            '<input type="text" class="first"/> <br\>' +
            '<input type="text" class="first"/> <br\>' +
            "</form>" +
            "</body>" +
            "</html>",
            selector: "form > input:nth-child(3)",
            path:"html body form input.first"
        }),
        getFakeElement({
            type: "input when some parent with id",
            description: "should get main parent id if needed, all parent tags,  element tag",
            html:
            "<html>" +
            "<body>" +
            "<form id='loginForm'>" +
            '<div>' +
            '<input type="text" class="first"/> <br\>' +
            '</div>' +
            "</form>" +
            '<div>' +
            '<input type="text" class="first"/> <br\>' +
            '</div>',
            selector: "form#loginForm > div > input"
        }),
        getFakeElement({
            type: "input with few class names",
            description: "should get main parent id, all parent tags,  element tag",
            html:
            "<html>" +
            "<body>" +
            "<form id='loginForm'>" +
            '<input type="text" class="first login"/> <br\>' +
            '<input type="text" class="first two"/> <br\>' +
            '<input type="text" class="first three"/> <br\>' +
            "</form>" +
            "</body>" +
            "</html>",
            selector: "form#loginForm > input.first.login",
            path:"html body form#loginForm input.first.login"
        })
    ];
})();

