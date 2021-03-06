<?php
session_start();
if (!isset($_SESSION['sessionVar'])) {
    $_SESSION = array();
    session_destroy();
    header("Location: ../login.php");
    echo "Logging Out";
}
?>
<!DOCTYPE html>
<html ng-app="myApp">
    <head>
        <meta http-equiv="content-type" content="text/html; charset=UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link type="text/css" rel="stylesheet" href="css/style.css">
        <link type="text/css" rel="stylesheet" href="lib/font-awesome/css/font-awesome.css">
        <!--<link href='http://fonts.googleapis.com/css?family=Open+Sans:400,600' rel='stylesheet' type='text/css'>-->
        <link href='http://fonts.googleapis.com/css?family=Lato' rel='stylesheet' type='text/css'>
        <title>Notes App</title>
        <!--<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>-->
        <script src="lib/jquery-1.11.0.min.js"></script>
        <script src="lib/angular/angular-file-upload-shim.js"></script>
        <script src="lib/angular/angular.min.js"></script>    
        <script src="lib/angular/angular-route.min.js"></script>
        <script src="lib/angular/angular-animate.min.js"></script>
        <script src="lib/angular/angular-file-upload.js"></script>
        <script src="js/notes.app.min.js"></script>
        <script src="lib/jquery.touchSwipe.min.js"></script>
    </head>

    <body>
        <div id="main" ng-controller="ParentController">

            <!-- angular templating -->
            <div class="load-view" ng-view></div>

        </div>
        <script src="lib/underscore-min.js"></script>
    </body>
</html>
