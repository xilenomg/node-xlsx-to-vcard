var FileController = require('../controllers/FileController');
var FileRequestController = {
	upload:function(request, response){
		if ( request.file ){
			FileController.doRead(request.file, function(result){
				response.setHeader('Content-type', 'application/text');
				response.setHeader('Content-disposition', 'attachment; filename=contato.vcf');
				response.end(result.join(""));
			});
		}
		else{
			throw new Error("File not found");
		}
	}
};

module.exports = FileRequestController;