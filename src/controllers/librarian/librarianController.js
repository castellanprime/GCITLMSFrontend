/**
 *  Librarian Controller
 */

lmsApp.controller("librarianController", function($scope, endpointConfig, lmsConstants){
	// Load branches
	endpointConfig.getAllObjects(lmsConstants.ALL_BRANCHES).then(function(data){
		$scope.branches = data;
	});
	
	endpointConfig.getAllObjects(lmsConstants.ALL_BOOKS).then(function(data){
		$scope.books = data;
	});
	
	// Edit branch
	$scope.editBranchModal = function(branch){
		$scope.branch = branch;
	}
	
	$scope.updateBranch = function(branch){
		console.log($scope.branches);
		console.log("Modifed branch: ", branch);
		endpointConfig.editObject(
			lmsConstants.SPECIFIC_BRANCH+$scope.branch.branchId, branch 
				).then(function(id){
			endpointConfig.getAllObjects(lmsConstants.ALL_BRANCHES).then(function(data){
				$scope.branches = data;
			})
		});
	}
	
	// Get the number of copies of a book in a branch
	$scope.selectBookToModifyCopiesOf = function(book, branch){
		$scope.bookToAddToBranch = book;
		endpointConfig.getAllObjects(
			lmsConstants.SPECIFIC_BRANCH_LIBRARIAN+$scope.branch.branchId+"/books/"+book.bookId+"/copies"
		).then(function(data){
			$scope.libraryCopies = data;
			console.log($scope.libraryCopies);
		});
	}
	
	// Update book copies in a branch
	$scope.updateBookCopiesInBranch = function(branch, total){
		console.log(branch);
		console.log(total);
		let libraryBookCopies = {};
		if ($scope.libraryCopies.branchId === 0 && $scope.libraryCopies.branchId === 0){
			libraryBookCopies = {
				bookId: $scope.bookToAddToBranch.bookId,
				branchId: branch.branchId,
				noOfCopies: total
			};
			console.log("Book copies to send: ", libraryBookCopies);
			endpointConfig.saveObject(
				lmsConstants.SPECIFIC_BRANCH_LIBRARIAN+"/books", libraryBookCopies
			).then(function(data){
				$scope.branches = data;
			});
		} else {
			libraryBookCopies = {
				bookId: $scope.libraryCopies.bookId,
				branchId: $scope.libraryCopies.branchId,
				noOfCopies: total
			};
			console.log("Book copies to send: ", libraryBookCopies);
			endpointConfig.editObject(
				lmsConstants.SPECIFIC_BRANCH_LIBRARIAN+"/books/copies", libraryBookCopies
			).then(function(data){
				$scope.branches = data;
			});
		}
		$scope.libraryCopies = null;
	}
	
	
	// Refresh Borrower list on clicking close
	$scope.resetBranch=function(){
		endpointConfig.getAllObjects(lmsConstants.ALL_BRANCHES).then(function(data){
			$scope.branches = data;
		});
		$scope.libraryCopies = null;
	}
	
});