XLSX = require('xlsx');
var FileController = {
    callbackDoRead: null,
    doRead: function(file, callback) {
        var workbook = XLSX.readFile(file.path);
        var first_sheet_name = workbook.SheetNames[0];
        var address_of_cell = 'A1';
        FileController.callbackDoRead = callback;

        /* Get worksheet */
        var worksheet = workbook.Sheets[first_sheet_name];

        var columns = [];
        for (a in worksheet) {
            if (a !== '!ref')
                columns.push(a);
        }

        // /* Find desired cell */
        // var desired_cell = worksheet[address_of_cell];

        // /* Get the value */
        // var desired_value = desired_cell.v;
        var rows = [];
        var reference = this.getRef(worksheet);
        for (var i = reference.firstRow; i <= reference.lastRow; i++) {
            var filteredColumn = columns.filter(function(a, b, c) {
                var coordinate = FileController.getCoordinate(a);
                if (coordinate)
                    return coordinate.row === i;
            });
            var data = [];
            var col = 0;
            filteredColumn.forEach(function(item) {
                data[col] = worksheet[item].v;
                col++;
            });
            rows.push(data);
        }

        this.generateVCF(rows);
    },

    getRef: function(worksheet) {
        var ref = worksheet['!ref'];
        if (!ref) {
            return null;
        }

        var columns = ref.split(":");
        var startCordinate = this.getCoordinate(columns[0]);
        var endCordinate = this.getCoordinate(columns[1]);
        return {
            firstColumn: startCordinate.column,
            firstRow: startCordinate.row,
            lastColumn: endCordinate.column,
            lastRow: endCordinate.row
        }
    },

    generateVCF: function(rows) {
        var all = [];
        rows.forEach(function(item) {
            all.push(FileController.singleVCFModel(item));
        });
        if (FileController.callbackDoRead)
            FileController.callbackDoRead(all);
    },

    singleVCFModel: function(line) {
        return "BEGIN:VCARD" +
            "\nVERSION:3.0" +
            "\nCLASS:PUBLIC" +
            "\nREV:" + Date.now() +
            "\nPRODID:-//NodeExcelToVCFConverter//NONSGML Version 1//EN" +
            "\nFN:" + line[0] +
            "\nTEL;TYPE=cell,voice:" + line[1] +
            (line[2] ? "\nTEL;TYPE=cell,voice:" + line[2] : '') +
            (line[3] ? "\nTEL;TYPE=cell,voice:" + line[3] : '') +
            "\nEND:VCARD\n\n"
    },

    getCoordinate: function(cell) {
        var regex = /([A-Z]+)([0-9]+)/;
        if (regex.test(cell)) {
            var coordinate = cell.match(regex);
            return {
                column: coordinate[1],
                row: parseInt(coordinate[2])
            }
        }
        return null;

    }
};

module.exports = FileController;
