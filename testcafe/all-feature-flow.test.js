"@fixture all-feature-flow";
"@page http://localhost:3000/";

"@test"["all-feature-flow"] = {
    '1.Click button "Join"': function() {
        act.click(":containsExcludeChildren(Join)");
    },
    '2.Type in input "Username:"': function() {
        act.type("#joinUsername", "a");
    },
    '3.Type in password input "Password:"': function() {
        act.type("#joinPassword", "a");
    },
    "4.Type in input": function() {
        act.type("#joinBalance", "100");
    },
    '5.Click submit button "Submit"': function() {
        act.click(":containsExcludeChildren(Submit)");
    },
    '6.Click button "Join"': function() {
        act.click(":containsExcludeChildren(Join)");
    },
    '7.Type in input "Username:"': function() {
        act.type("#joinUsername", "b");
    },
    '8.Type in password input "Password:"': function() {
        act.type("#joinPassword", "b");
    },
    "9.Type in input": function() {
        act.type("#joinBalance", "200");
    },
    '10.Click submit button "Submit"': function() {
        act.click(":containsExcludeChildren(Submit)");
    },
    '11.Click button "Login"': function() {
        act.click("[name='login'].btn.btn-link[data-toggle='modal'][data-target='#loginModal']");
    },
    '12.Type in input "Username"': function() {
        act.type("#loginUsername", "a");
    },
    '13.Type in password input "Password:"': function() {
        act.type("#loginPassword", "a");
    },
    '14.Click submit button "Login"': function() {
        var actionTarget = function() {
            return $("#loginModal").find(":containsExcludeChildren(Login)");
        };
        act.click(actionTarget);
    },
    '15.Click link "@a"': function() {
        var actionTarget = function() {
            return $(":containsExcludeChildren(a)").eq(1);
        };
        act.click(actionTarget);
    },
    '16.Click link "@a"': function() {
        var actionTarget = function() {
            return $(":containsExcludeChildren(a)").eq(1);
        };
        act.click(actionTarget);
    },
    "17.Click <svg>": function() {
        act.click(".svg-inline--fa.fa-cog.fa-w-16.fa-3x[data-fa-transform='down-3'][data-prefix='fas'][data-icon='cog']");
    },
    '18.Type in password input "Change password:"': function() {
        act.type("#newPassword", "c");
    },
    '19.Click submit button "Save"': function() {
        act.click(":containsExcludeChildren(Save)");
    },
    "20.Click <path>": function() {
        var actionTarget = function() {
            return $(".svg-inline--fa.fa-sign-out-alt.fa-w-16.fa-3x[data-fa-transform='down-3'][data-prefix='fas'][data-icon='sign-out-alt']").find(" > g:nth(0) > g:nth(0) > path:nth(0)");
        };
        act.click(actionTarget);
    },
    '21.Type in input "Username"': function() {
        act.type("#loginUsername", "a");
    },
    '22.Type in password input "Password:"': function() {
        act.type("#loginPassword", "c");
    },
    '23.Click submit button "Login"': function() {
        var actionTarget = function() {
            return $("#loginModal").find(":containsExcludeChildren(Login)");
        };
        act.click(actionTarget);
    },
    "24.Click input": function() {
        act.click("#amount");
    },
    "25.Press key BACKSPACE": function() {
        act.press("backspace");
    },
    "26.Press key BACKSPACE": function() {
        act.press("backspace");
    },
    "27.Press key BACKSPACE": function() {
        act.press("backspace");
    },
    "28.Press key BACKSPACE": function() {
        act.press("backspace");
    },
    "29.Press key BACKSPACE": function() {
        act.press("backspace");
    },
    "30.Press key BACKSPACE": function() {
        act.press("backspace");
    },
    "31.Press key BACKSPACE": function() {
        act.press("backspace");
    },
    "32.Press key BACKSPACE": function() {
        act.press("backspace");
    },
    "33.Type in input": function() {
        act.type("#amount", "100000000");
    },
    '34.Type in input "to"': function() {
        act.type("#recipient", "b");
    },
    '35.Type in input "message"': function() {
        act.type("#message", "this will fail");
    },
    '36.Click submit button "✔"': function() {
        act.click(".btn.btn-primary.payment-button");
    },
    "37.Type in input": function() {
        act.type("#amount", "10");
    },
    '38.Type in input "to"': function() {
        act.type("#recipient", "asdfasdf");
    },
    '39.Type in input "message"': function() {
        act.type("#message", "this will also fail");
    },
    '40.Click submit button "✔"': function() {
        act.click(".btn.btn-primary.payment-button");
    },
    "41.Click <path>": function() {
        var actionTarget = function() {
            return $(".svg-inline--fa.fa-sign-out-alt.fa-w-16.fa-3x[data-fa-transform='down-3'][data-prefix='fas'][data-icon='sign-out-alt']").find(" > g:nth(0) > g:nth(0) > path:nth(0)");
        };
        act.click(actionTarget);
    }
};

