"@fixture account";
"@page http://localhost:3000";

"@test"["account"] = {
    '1.Click button "Join"': function() {
        act.click(":containsExcludeChildren(Join)");
    },
    '2.Type in input "Username:"': function() {
        act.type("#joinUsername", "c");
    },
    '3.Type in password input "Password:"': function() {
        act.type("#joinPassword", "c");
    },
    '4.Type in input "Dash Address:"': function() {
        act.type("#joinDashAddress", "asdfasdf");
    },
    '5.Type in input "Private Key:"': function() {
        act.type("#privateKey", "fdsafdsa");
    },
    '6.Click submit button "Submit"': function() {
        act.click(":containsExcludeChildren(Submit)");
    },
    '7.Click button "Login"': function() {
        act.click("[name='login'].btn.btn-link[data-toggle='modal'][data-target='#loginModal']");
    },
    '8.Type in input "Username"': function() {
        act.type("#loginUsername", "c");
    },
    '9.Type in password input "Password:"': function() {
        act.type("#loginPassword", "c");
    },
    '10.Click submit button "Login"': function() {
        var actionTarget = function() {
            return $("#loginModal").find(":containsExcludeChildren(Login)");
        };
        act.click(actionTarget);
    },
    "11.Click <path>": function() {
        var actionTarget = function() {
            return $(".svg-inline--fa.fa-sign-out-alt.fa-w-16.fa-3x[data-fa-transform='down-3'][data-prefix='fas'][data-icon='sign-out-alt']").find(" > g:nth(0) > g:nth(0) > path:nth(0)");
        };
        act.click(actionTarget);
    }
};

