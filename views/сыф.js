    var clicks = 0;  

	
function register()
{
var login = document.getElementById("login").value; 
var pas = document.getElementById("pas").value;
document.cookie = encodeURIComponent(login) + '=' + encodeURIComponent(pas);
alert(document.cookie);
}

function logining()
{
var login = document.getElementById("login1").value; 
var pas = document.getElementById("pas1").value;
var pas2 = get_cookie(login);
if (pas != pas2)
{
alert("Пароль не верный");
}
else
{
document.location.href = "site3.html";
}
}
	
    function plusClick() {
        clicks += 1;
        document.getElementById("clicks").innerHTML = clicks;
		document.getElementById("login").innerHTML = "Здравствуйте, " + login
    }
    function minusClick() {
	    if (clicks != 0)
        {		
        clicks -= 1;
        document.getElementById("clicks").innerHTML = clicks;
		}
    }

function get_cookie(cookie_name)
{
  var results = document.cookie.match ( '(^|;) ?' + cookie_name + '=([^;]*)(;|$)' );
 
  if (results)
    return (unescape( results[2] ) );
  else
    return null;
}

function show() {
    document.getElementById('window').style.display = 'block';  
    document.getElementById('gray').style.display = 'block';        
    }   
function hide() {
    document.getElementById('window').style.display = 'none';   
    document.getElementById('gray').style.display = 'none';     
}
function preventDefault(e) {
    e.preventDefault();
    e.stopPropagation();
}


