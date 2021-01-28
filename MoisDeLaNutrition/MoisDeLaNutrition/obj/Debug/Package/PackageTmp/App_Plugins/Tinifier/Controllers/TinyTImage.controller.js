﻿angular.module("umbraco").controller("Tinifier.TinyTImage.Controller", function ($scope, $routeParams, $http, notificationsService,
    dialogService, navigationService, tinifierApiUrlsResource) {
    // Get the ID from the route parameters (URL)
    var timageId = $routeParams.id;

    var arrOfNames = [];
    var selectedImages = document.querySelectorAll(".-selected");

    for (var i = 0; i < selectedImages.length; i++) {
        var innerHtml = selectedImages[i].innerHTML;
        var regex = /<img.*?src=['"](.*?)['"]/;
        var src = regex.exec(innerHtml)[1];
        var slice = src.split("?")[0];
        arrOfNames.push(slice);
    }

    // RecycleBinFolderId
    var recycleBinFolderId = "-21";

    // Get from the API
    $scope.timage = null;

    // Tinify Image and show notification
    $scope.tinify = function () {
        navigationService.hideDialog();
        // Check if user choose Image or recycle bin folder
        if (timageId === recycleBinFolderId) {
            notificationsService.error("Error", "You can`t tinify RecycleBin Folder!");
            return;
        }

        if (timageId == null) {
            notificationsService.error("Error", "If you wish to optimize full Media folder, please, go to Tinifier section and click Tinify everything");
            return;
        }

        notificationsService
            .add({
                headline: "Tinifing started",
                message: "click here for more details",
                url: '/umbraco/#/tinifier',
                type: 'success'
            });

        var url = arrOfNames.length !== 0
            ? `${tinifierApiUrlsResource.tinifier}/TinyTImage?${$.param({ imageRelativeUrls: arrOfNames, mediaId: 0 })}`
            : `${tinifierApiUrlsResource.tinifier}/TinyTImage?mediaId=${timageId}`;

        $http.get(url)
            .success(successHandler)
            .error(errorHandler);
    };

    $scope.undoTinify = function() {
        navigationService.hideDialog();
        // Check if user choose Image or recycle bin folder
        if (timageId === recycleBinFolderId) {
            notificationsService.error("Error", "You can`t tinify RecycleBin Folder!");
            return;
        }

        if (timageId == null) {
            notificationsService.error("Error", "Undo tinifing all Media folder is not supported");
            return;
        }

        notificationsService
            .add({
                headline: "Undo Tinifing started",
                type: 'success'
            });

        var url = `${tinifierApiUrlsResource.tinifier}/UndoTinify?mediaId=${timageId}`;

        $http.get(url)
            .success(successHandler)
            .error(errorHandler);
    };

    $scope.tinifyAll = function () {
        $http.put(`${tinifierApiUrlsResource.tinifier}/TinifyEverything`)
            .success(successHandler)
            .error(errorHandler);
    };

    function successHandler(response) {
        notificationsService.add(response);
    }

    function errorHandler(response) {
        notificationsService.add(response);
    }
});