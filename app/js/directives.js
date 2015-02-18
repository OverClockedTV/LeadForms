'use strict';
angular.module('reusableThings', []).directive('fileDropzone', function() {

    // add the dataTransfer property for use with the native drop event
    // to capture information about files dropped into the browser window

    return {
        restrict: 'A',
        scope: {
            file: '=',
            fileName: '='
        },
        link: function(scope, element, attrs) {

            var checkSize, isTypeValid, processDragOverOrEnter, validMimeTypes;
            processDragOverOrEnter = function(event) {

                if (event != null) {
                    event.preventDefault();
                    event.dataTransfer.setData( 'text/plain', 'stop' );//FIREFOX FIX!!!!!!!
                    console.log(event);

                }
                event.dataTransfer.effectAllowed = 'copy';
                return false;
            };
            validMimeTypes = attrs.fileDropzone;
            checkSize = function(size) {
                var _ref;
                if (((_ref = attrs.maxFileSize) === (void 0) || _ref === '') || (size / 1024) / 1024 < attrs.maxFileSize) {
                    return true;
                } else {
                    alert("File must be smaller than " + attrs.maxFileSize + " MB");
                    return false;
                }
            };
            isTypeValid = function(type) {
                if ((validMimeTypes === (void 0) || validMimeTypes === '') || validMimeTypes.indexOf(type) > -1) {
                    return true;
                } else {
                    alert("Invalid file type.  File must be one of following types " + validMimeTypes);
                    return false;
                }
            };
            element.bind('dragover', processDragOverOrEnter);
            element.bind('dragenter', processDragOverOrEnter);
            return element.bind('drop', function(event) {
                console.log(event);
                var file, name, reader, size, type;
                if (event != null) {
                    event.preventDefault();

                }
                reader = new FileReader();
                reader.onload = function(evt) {
                    if (checkSize(size) && isTypeValid(type)) {
                        return scope.$apply(function() {
                            scope.file = evt.target.result;
                            if (angular.isString(scope.fileName)) {
                                return scope.fileName = name;
                            }
                        });
                    }
                };

                file = event.dataTransfer.files[0];

                name = file.name;
                type = file.type;
                size = file.size;
                reader.readAsDataURL(file);
                return false;
            });
        }
    };
});
