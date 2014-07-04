<?php
session_start();
$_SESSION['id'] = '123456';
$_SESSION['username'] = 'Ajay';
if (isset($_POST['sessionVar'])) {
    $_SESSION['sessionVar'] = $_POST['sessionVar'];
}
if (!isset($_SESSION['id'])) {
    echo "logout";
} else {
    ?>
    <!DOCTYPE html>
    <html>
        <head>
            <title>TODO supply a title</title>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <script src="jquery-1.11.0.min.js"></script>
        </head>
        <body>
            <h1>Hello <?php
                echo $_SESSION['username']
                ?></h1>
            <a href="index.php" >Notes App</a>
            <p>Your id is <?php echo $_SESSION['id']; ?></p>
            <form action="apps.php" method="POST">
                <input type="submit" value="logout" name="logout" />
            </form>
            <script>
                if (typeof sessionStorage['sessionVar'] === 'undefined' ||
                        sessionStorage['sessionVar'] === '') {
                    sessionStorage['sessionVar'] = 'ABCDEFGH';
                    var xmlhttp = new XMLHttpRequest();
                    xmlhttp.onreadystatechange = function()
                    {
                        if (xmlhttp.readyState === 4 && xmlhttp.status === 200)
                        {
                            console.log(xmlhttp.responseText);
                        }
                    }
                    xmlhttp.open("POST", "apps.php", true);
                    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                    xmlhttp.send("sessionVar=" + sessionStorage['sessionVar']);
                }
            </script>
        </body>
    </html>
    <?php
}