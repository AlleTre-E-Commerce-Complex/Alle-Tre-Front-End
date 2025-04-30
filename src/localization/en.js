import localizationKeys from "./localization-keys";

const en = {
  // auth
  [localizationKeys.login]: "Login",
  [localizationKeys.signup]: "Sign up",
  [localizationKeys.loginOrRegister]: "Login/Register",
  [localizationKeys.loginWithApple]: "Login With Apple",
  [localizationKeys.loginwithGoogle]: "Login With Google",
  [localizationKeys.loginwithFacebook]: "Login With Facebook",
  [localizationKeys.signupwithApple]: "Sign up With Apple",
  [localizationKeys.signupwithGoogle]: "Sign up With Google",
  [localizationKeys.signupwithFacebook]: "Sign up With Facebook",
  [localizationKeys.rememberPassword]: "Remember Password",
  [localizationKeys.forgetPassword]: "Forget Password",
  [localizationKeys.somethingWentWrongPleaseTryAgainLater]:
    "Something went wrong, please try again later",
  [localizationKeys.name]: "Name",
  [localizationKeys.email]: "E-mail",
  [localizationKeys.phone]: "Phone",
  [localizationKeys.password]: "Password",
  [localizationKeys.iAgreetotheTermsConditions]:
    "I agree to the Terms & Conditions",
  [localizationKeys.createAccount]: "Create Account",
  [localizationKeys.aVerificationMailHasBeenSent]:
    "A verification mail has been sent to your mail please check it....",
  [localizationKeys.thePasswordHasBeenSuccessfullyChanged]:
    "The password has been successfully changed.",
  [localizationKeys.backToHome]: "Back to Home",
  [localizationKeys.resetPassword]: "Reset Password",
  [localizationKeys.newPassword]: "New Password",
  [localizationKeys.reEnterPassword]: "Re-Enter Password",
  [localizationKeys.theEmailAddressForThisAccountHasNotYetBeenVerified]:
    "The email address for this account has not yet been verified. Please check your inbox. If you cannot find this email,",
  [localizationKeys.resendMailAgain]: "Resend mail again",
  [localizationKeys.or]: "OR",
  [localizationKeys.backToLogin]: "Back to Login",
  [localizationKeys.sentVerification]: "Send verification",
  [localizationKeys.securityDeposit]: "Security Deposit",
  [localizationKeys.yourWalletBalanceIsAED]: "Your Wallet Balance is AED",
  [localizationKeys.payAED]: "Pay AED",
  [localizationKeys.fromWallet]: "From Wallet",
  // home
  [localizationKeys.changeStatus]: "Change status",
  [localizationKeys.convertToAuction]: "Convert to auction",
  [localizationKeys.viewContactDetails]: " View contact details",
  [localizationKeys.trendingAuctions]: "Trending Auctions",
  [localizationKeys.postedBy]: "Posted by",
  [localizationKeys.type]: "Type",
  [localizationKeys.filterOptions]: "Filter options",
  [localizationKeys.filter]: "Filter",
  [localizationKeys.selectOptions]: "Select options",
  [localizationKeys.clearAll]: "Clear All",
  [localizationKeys.subscribedSuccessfully]: "subscribed successfully",
  [localizationKeys.unsubscribedSuccessfully]:
    "You have been successfully unsubscribed.",
  [localizationKeys.unsubscriptionFailed]: "Unsubscribe failed.",
  [localizationKeys.myBids]: "My Bids",
  [localizationKeys.myProducts]: "My Products",
  [localizationKeys.categories]: "Categories",
  [localizationKeys.watchlist]: "Watchlist",
  [localizationKeys.faqs]: "FAQs",
  [localizationKeys.support]: "Support",
  [localizationKeys.arabic]: "عربي",
  [localizationKeys.english]: "English",
  [localizationKeys.sellNow]: "Sell Now",
  [localizationKeys.search]: "Search...",
  [localizationKeys.registerNow]: "Register Now",
  [localizationKeys.profile]: "Profile",
  [localizationKeys.viewDetails]: "View Details",
  [localizationKeys.bidNow]: "Bid Now",
  [localizationKeys.popularCategories]: "Popular Categories",
  [localizationKeys.results]: "Results",
  [localizationKeys.seeAll]: "See all",
  [localizationKeys.seeLess]: "see Less",
  [localizationKeys.brand]: "Brand",
  [localizationKeys.sellingType]: "Selling Type",
  [localizationKeys.auction]: "Auctions",
  [localizationKeys.products]: "Products",
  [localizationKeys.all]: "All",
  [localizationKeys.buyNow]: "Buy Now",
  [localizationKeys.expiredAuctions]: "Expired Auctions",
  [localizationKeys.deliveryPolicy]: "Delivery Policy",
  [localizationKeys.expectedDeliveryDays]: "Expected Delivery Days",
  [localizationKeys.deliveryFees]: "Delivery Fees",
  [localizationKeys.locatedIn]: "Located In ",
  [localizationKeys.returnPolicy]: "Return Policy",
  [localizationKeys.noReturnPolicy]: "No Return Policy",
  [localizationKeys.warrantyPolicy]: "Warranty Policy",
  [localizationKeys.noWarrantyPolicy]: "No Warranty Policy",
  [localizationKeys.auctionState]: "Auction State",
  [localizationKeys.comingSoon]: "Coming Soon",
  [localizationKeys.liveAuction]: "Live Auction",
  [localizationKeys.location]: "Location",
  [localizationKeys.condition]: "Condition",
  [localizationKeys.new]: "New",
  [localizationKeys.used]: "Used",
  [localizationKeys.openBox]: "Open Box",
  [localizationKeys.price]: "Price",
  [localizationKeys.createAuctionNow]: "Create Auction Now",
  [localizationKeys.weAreAlwaysHereToHelpYou]:
    "We're Always Here To Help You...",
  [localizationKeys.subscribeNowToGetNewOffersAndUpdates]:
    "Subscribe Now to Get new offers and updates",
  [localizationKeys.writeYourMail]: "Write Your Mail...",
  [localizationKeys.subscribe]: "Subscribe",
  [localizationKeys.sellingOnAllatre]: "Selling on Allatre",
  [localizationKeys.sellerCenter]: "Seller Center",
  [localizationKeys.sellForCharity]: "Sell for charity",
  [localizationKeys.businessTools]: "Business tools",
  [localizationKeys.createAuction]: "Create Auction",
  [localizationKeys.listProduct]: "List Product",
  [localizationKeys.price]: "Price",
  [localizationKeys.changeProductStatus]: "Change Product Status Here",
  [localizationKeys.myAccount]: "My Account",
  [localizationKeys.iamBiddingOn]: "I'm Bidding On",
  [localizationKeys.iHaveBought]: "I've Bought",
  [localizationKeys.bidsIHaveReceived]: "Bids I've Received",
  [localizationKeys.iHaveSold]: "I've Sold",
  [localizationKeys.allRightsReserved]: "All rights reserved.",
  [localizationKeys.upComingAuctions]: "Up-coming Auctions",
  [localizationKeys.totalBids]: "Total Bids",
  [localizationKeys.yourPendingPaymentsAreListedHere]:
    "Your pending payments are listed here",
  [localizationKeys.bid]: "Bid",
  [localizationKeys.endingTime]: "Ending Time",
  [localizationKeys.days]: "d",
  [localizationKeys.hrs]: "h",
  [localizationKeys.min]: "m",
  [localizationKeys.sec]: "s",
  [localizationKeys.achieveVisuallyImpressiveAuctionAttractBiddersMoreEasily]:
    "Achieve a visually impressive auction & attract bidders more easily.",
  [localizationKeys.YouCanMakeYourAuctionAdPriorityAndDisplayItFirstToIncreaseBidder]:
    " You can make your auction Ad a priority and display it first to increase bidder",
  [localizationKeys.participationAndAttractMoreBidders]:
    " participation and attract more bidders",
  [localizationKeys.CreateyourAdNow]: "Create your Ad Now",
  [localizationKeys.PopularPicksPerfectChoices]:
    "Popular Picks, Perfect Choices",
  [localizationKeys.Grid]: "Grid",
  [localizationKeys.List]: "List",
  [localizationKeys.ThereAreAuctionsCurrentlyYouCanCreateYourOwnAuctionRightNow]:
    " There are no auctions currently. You can create your own auction right now",
  [localizationKeys.BidWinRepeat]: "Bid, Win, Repeat!",
  [localizationKeys.ComingSoonGetReadytoBid]: " Coming Soon: Get Ready to Bid!",
  [localizationKeys.DontWaitBuyNow]: "   Don't Wait, Buy Now!",
  [localizationKeys.Bysubscribingyounevermissbeat]:
    "By subscribing, you'll never miss a beat.",
  [localizationKeys.Stayinformedaboutourlatestproductarrivalsspecialpromotionsandseasonalsales]:
    "Stay informed about our latest product arrivals, special promotions, and seasonal sales.",
  [localizationKeys.termsAndCondition]: "Terms and Condition",
  [localizationKeys.iAcceptThe]: "I accept the",
  [localizationKeys.close]: "Close",
  [localizationKeys.sell]: "Sell",
  [localizationKeys.timing]: "Timing",
  [localizationKeys.selectTheDeliveryType]: "Select the delivery type",
  [localizationKeys.sellerAddress]: "Seller address",
  [localizationKeys.apply]: "Apply",
  [localizationKeys.noMoreAuctions]: "No more auctions",
  [localizationKeys.youCanUseYourBonusAmountUsingWalletPayment]:
    " You can use your bonus amount using wallet payment",
  [localizationKeys.highest]: "Highest",
  [localizationKeys.bidder]: "Bidder",
  [localizationKeys.listedProducts]: "Listed products",
  [localizationKeys.noActiveAuctions]: "No active auctions",
  [localizationKeys.thisUserHasntPostedAnyAuctionsYet]:
    "This user hasn't posted any auctions yet",
  [localizationKeys.noListedProducts]: "No listed products",
  [localizationKeys.thisUserHasntListedAnyProductsYet]:
    " This user hasn't listed any products yet",
  [localizationKeys.noUserSpecified]: "No user specified",
  [localizationKeys.errorProcessingImages]: "Error processing images",
  [localizationKeys.uploadPdfDocument]: "Upload PDF Document",
  [localizationKeys.maxSize]: "Max size:",
  [localizationKeys.dragAndDropYourPdfHereOr]:
    "Drag and drop your PDF here, or",
  [localizationKeys.clickToBrowse]: "click to browse",
  [localizationKeys.document]: "Document",
  [localizationKeys.tapToZoom]: "Tap to zoom",
  [localizationKeys.listYourPropertyForSale]: "List your property for sale",
  [localizationKeys.rent]: "Rent",
  [localizationKeys.listYourPropertyForRent]: "List your property for rent",
  [localizationKeys.discoverTrendingAuctionsWithExclusiveDeals]:
    "Discover trending auctions with exclusive deals",
  [localizationKeys.hotAuctions]: "Hot Auctions",
  // status
  [localizationKeys.activeNow]: "Active Now",
  [localizationKeys.Scheduled]: "  Scheduled",
  [localizationKeys.sold]: "Sold",
  [localizationKeys.pending]: "Pending",
  [localizationKeys.waitingForPayment]: "Waiting For Payment",
  [localizationKeys.soldOut]: "Sold Out",
  [localizationKeys.expired]: "Expired",
  [localizationKeys.inProgress]: "In Progress",
  // Breadcrumb
  [localizationKeys.home]: "Home",
  [localizationKeys.productDetails]: "Product Details",
  [localizationKeys.auctionDetails]: "Auction Details",
  [localizationKeys.shippingDetails]: "Shipping Details",
  [localizationKeys.paymentDetails]: "Payment Details",
  [localizationKeys.myAuctions]: "My Auctions",
  [localizationKeys.activeAuctions]: "Active Auctions",
  [localizationKeys.scheduledAuctions]: "Scheduled Auctions",
  [localizationKeys.soldAuctions]: "Sold Auctions",
  [localizationKeys.pendingAuctions]: "Pending Auctions",
  [localizationKeys.expiredAuctions]: "Expired Auctions",
  [localizationKeys.payDeposite]: "Pay Deposite",
  [localizationKeys.yourDepositHasBeenSuccessfullyMadeAndYourBidHasBeenPlacedGoodLuck]:
    "Your deposit has been successfully made and your bid has been placed. Good luck!",
  [localizationKeys.inOrderToCompletePublishingYourAdSuccessfullyPleasePayTheAdFeeAndStartReceivingBidsImmediately]:
    "In order to complete publishing your auction successfully, please pay the auction fee and start receiving bids immediately.",
  [localizationKeys.adPreview]: "Ad Preview",
  [localizationKeys.auctionFee]: "Auction Fee",
  [localizationKeys.feesRefundedAfterAuctionCompletion]:
    "Fees refunded after auction completion",
  [localizationKeys.ifYouWantToCheckAuctionsPolicyYouCanCheck]:
    "If you want to check auction's policy, you can check",
  [localizationKeys.paymentMethod]: "Payment Method",
  [localizationKeys.PaymentCompleted]: "Payment Completed",
  [localizationKeys.YouveAlreadyCompletedThePaymentForThisAuction]:
    "You've already completed the payment for this auction",
  [localizationKeys.viewPendingPayments]: "View Pending Payments",
  [localizationKeys.continuePayment]: "Continue Payment",
  [localizationKeys.yourPaymentDetailsAreSaved]:
    "Your payment details are saved",
  [localizationKeys.auctionStartingPrice]: "Auction Starting Price",
  [localizationKeys.auctionStartingDate]: "Auction Starting Date",
  [localizationKeys.auctionEndingDate]: "Auction Ending Date",
  [localizationKeys.inOrderToCompleteSubmittingYourBidPleasePayTheDepositForTheAuction]:
    "In order to complete the bidding process, please pay the auction deposit.",
  [localizationKeys.pleaseNoticeThatTheBiddingDepositWillBeCapturedUntilTheAuctionIsCompletedWithin3WorkingDaysIfYouWinsTheAuctionTheWebsiteWillWithdrawTheDeposit]:
    "Please notice that The bidding deposit will be captured until the auction is completed within 3 working days. if you wins the auction, the website will withdraw the deposit.",
  [localizationKeys.shopSustainableChoosePreOwned]:
    "Shop Sustainable: Choose Pre-Owned",
  [localizationKeys.getItNewFeeltheDifference]:
    "Get It New, Feel the Difference",
  [localizationKeys.locationNotAvailable]: "Location not available",
  [localizationKeys.selectSubCategory]: "Select sub-category",
  // create auctions
  [localizationKeys.drafts]: "Drafts",
  [localizationKeys.proceed]: "Proceed",
  [localizationKeys.successDelete]:
    "Your auction has been deleted for you from drafting successfully",
  [localizationKeys.errorDelete]:
    "oops, sorry something with wrong please make sure everything is correct and try again",
  [localizationKeys.confirmDeletedraft]: "Confirm delete draft",
  [localizationKeys.areYouSureYouWantToDeleteThisDraft]:
    "Are you sure you want to delete this draft",
  [localizationKeys.cancel]: "Cancel",
  [localizationKeys.logOut]: "Log Out",
  [localizationKeys.updatedSuccessfully]: "Auction updated successfully",
  [localizationKeys.areYouSureYouWantToLogOut]:
    "Are you sure you want to log out?",
  [localizationKeys.confirmLogout]: "Confirm Logout",
  [localizationKeys.skip]: "Skip",
  [localizationKeys.YesISentIt]: "Yes, I  sent it",
  [localizationKeys.yesDelete]: "Yes,delete",
  [localizationKeys.locationIsRequired]: "Location is required",
  [localizationKeys.editLocation]: "Edit Location",
  [localizationKeys.inOrderToFinishTheProcedureWeHaveToGetAccessTo]:
    "In order to finish the procedure, we have to get access to",
  [localizationKeys.yourLocationYouCanManageThemLater]:
    "your location. you can manage them later .",
  [localizationKeys.manageYouAddresses]: "Manage you addresses",
  [localizationKeys.country]: "Country",
  [localizationKeys.city]: "City",
  [localizationKeys.address]: "Address",
  [localizationKeys.addressLabel]: "Address Label",
  [localizationKeys.zipCode]: "Postal code",
  [localizationKeys.successAddLocatons]: "Location added successfully",
  [localizationKeys.add]: "Add",
  [localizationKeys.selectCountry]: "Select Country",
  [localizationKeys.selectCity]: "Select City",
  [localizationKeys.wirteYourAddress]: "Wirte your address",
  [localizationKeys.exHome]: "ex: Home",
  [localizationKeys.enterPostalZipCode]: "Enter postal/Zip code",
  [localizationKeys.building]: "  Julphar Tower, Office Number: 504,",
  [localizationKeys.place]: "Ras Al Khaimah,",
  [localizationKeys.uae]: "United Arab Emirates",
  // product details
  [localizationKeys.itemDetails]: "Item Details",
  [localizationKeys.itemName]: "Item Name",
  [localizationKeys.category]: "Category",
  [localizationKeys.subCategory]: "Sub Category",
  [localizationKeys.itemDescription]: "Item Description",
  [localizationKeys.writeItemDescription]: "Write Item Description....",
  [localizationKeys.addMedia]: "Add Media",
  [localizationKeys.from3upto5photos]: "( from 3 up to 5 photos )",
  [localizationKeys.itemCondition]: "Item Condition",
  [localizationKeys.saveAsDraft]: "Save As Draft",
  [localizationKeys.next]: "Next",
  [localizationKeys.youCanOnlySelectUpToFiftyImages]:
    "You can only select up to 50 images",
  [localizationKeys.relatedDocument]: "Related document",
  [localizationKeys.Pdfdocument]: "PDF Document",
  [localizationKeys.videoCannotBeTheFirstUploadPleaseUploadAnImageFirstAsItWillBeUsedAsTheCover]:
    "Video cannot be the first upload. Please upload an image first as it will be used as the cover.",
  [localizationKeys.onlyOneVideoFileIsAllowed]:
    "Only one video file is allowed",
  [localizationKeys.uploadOneImageAndOneVideo]:
    "* You can upload up to 50 images and 1 video (max 50MB). Videos must be uploaded separately from images.",
  [localizationKeys.fileSizeShouldBeLessThan10MB]:
    "File size should be less than 10MB",
  [localizationKeys.thisAuctionAddedToWatchListSuccessfully]:
    "This auction added to WatchList successfully",
  [localizationKeys.thisAuctionRemovedFromWatchListSuccessfully]:
    "This auction removed from WatchList successfully",
  [localizationKeys.imageDeletedSuccessfully]: "Image deleted successfully",
  [localizationKeys.failedToDeleteImage]: "Failed to delete image",
  [localizationKeys.coverPhotoUpdatedSuccessfully]:
    "Cover photo updated successfully",
  [localizationKeys.failedToUpdateCoverPhoto]: "Failed to update cover photo",
  [localizationKeys.cannotMixVideoAndImages]:
    "Please upload either video or images, not both at once.",
  [localizationKeys.videoSizeLimitExceeded]:
    "Video size must be less than 50 MB",
  [localizationKeys.errorInWatermarkProcess]: "Error in watermark process",
  [localizationKeys.fileConversionFailed]: "File conversion failed",
  [localizationKeys.setAsCover]: "Set as cover",
  [localizationKeys.cover]: "Cover",
  [localizationKeys.editingImagesAndDocumentsIsDisabledWhileUpdatingTheAuction]:
    "Editing images and documents is disabled while updating the auction",
  [localizationKeys.editingDisabled]: "Editing disabled",

  //List product
  [localizationKeys.call]: "Call",
  [localizationKeys.chat]: "Chat",
  [localizationKeys.sellingPrice]: "Selling Price",
  [localizationKeys.listed]: "Listed",
  [localizationKeys.listedProduct]: "Listed Product",
  [localizationKeys.findAndReachTheProduct]: "Find and reach the product",
  [localizationKeys.theBestDealsYouMissed]: "The best deals you missed",
  [localizationKeys.callNow]: "Call now",
  [localizationKeys.contactNumber]: "Contact Number",
  [localizationKeys.youCanConnectOn]: "You can connect on:",
  [localizationKeys.DontForgetToMention]: "Don't forget to mention",
  [localizationKeys.alletre]: "Alletre",
  [localizationKeys.whenYouCall]: "When you call!",

  // auction details
  [localizationKeys.quickAuction]: "Quick Auction",
  [localizationKeys.maximumDurationMustBeDay]: "Maximum duration must be day",
  [localizationKeys.longAuction]: "Long Auction",
  [localizationKeys.durationMoreThanOneDayFromStartingDate]:
    "Duration more than one day from starting date",
  [localizationKeys.longAuction]: "Long Auction",
  [localizationKeys.Hrs]: "Hrs.",
  [localizationKeys.Hrs]: "Hrs.",
  [localizationKeys.auctionDuration]: "Auction Duration",
  [localizationKeys.scheduleBid]: "Schedule Bid",
  [localizationKeys.optional]: "(Optional)",
  [localizationKeys.unlessStartTimeAndDateAreChosenYourListingBecomesActiveImmediately]:
    "Unless a start time and date are chosen, your listing becomes active immediately.",
  [localizationKeys.amountThatYouCanSellWithoutAuction]:
    "Amount that you can sell without auction",
  [localizationKeys.youCanGiveHereYourDeliveryRelatedPolicy]:
    "You can give your own delivery related policy here, ",
  [localizationKeys.youCanGiveHereYourReturnRelatedPolicy]:
    "You can give your own return related policy here ",
  [localizationKeys.youCanGiveHereYourWarrantyRelatedPolicy]:
    "You can give your own warranty related policy here ",
  [localizationKeys.startDate]: "Start Date",
  [localizationKeys.howManyDaysWillItTakeForTheDeliveryAfterAuctionExpired]:
    "How many days will it take for the delivery after auction expired ?",
  [localizationKeys.includingDeliveryDateAndOthers]:
    "Including delivery date and others..",
  [localizationKeys.time]: "Time",
  [localizationKeys.NumberOfDays]: "Number of days",
  [localizationKeys.DeliveryFees]: "Delivery Fees",
  [localizationKeys.Amount]: "Amount",
  [localizationKeys.pricing]: "Pricing",
  [localizationKeys.startPrice]: "Start Price",
  [localizationKeys.purchasingPrice]: "Purchasing Price",
  [localizationKeys.PolicyDescription]: "Policy Description",
  [localizationKeys.PleaseGiveTheDescription]: "Please Give Your Description",
  [localizationKeys.minimum30MoreThanStartingBid]:
    "Minimum: 30% more than starting bid",
  [localizationKeys.purchasingPriceMustBeMoreThanOrEqual30OfMinimumPrice]:
    "Purchasing price must be more than or equal 30% of minimum price",
  [localizationKeys.whyWaitingBuyItNowOnThisPrice]:
    "Why waiting? Buy it now on this price!",
  [localizationKeys.similarProducts]: "Similar Products",
  [localizationKeys.exploreRelatedFind]: "Explore Related Find",
  [localizationKeys.auctionCancelledBySellerMessage]:
    "This auction has been cancelled by the seller.",
  [localizationKeys.auctionCancelledByAdminMessage]:
    "This auction has been cancelled by the administrator. ",
  [localizationKeys.auctionCancelled]: "Auction Cancelled",
  // shiping details
  [localizationKeys.locationDetails]: "Location Details",
  [localizationKeys.addAddress]: "Add Address",
  [localizationKeys.successUpdateLocation]: "Location updated successfully",
  [localizationKeys.confirmDeleteAddress]:
    "Are you sure you want to delete this address?",
  [localizationKeys.addressDeletedSuccessfully]: "Address deleted successfully",
  [localizationKeys.errorDeletingAddress]: "Error deleting address",
  [localizationKeys.deleteAddress]: "Delete Address",
  [localizationKeys.cannotDeleteMainAddress]: "Cannot delete main address",
  [localizationKeys.confirmDeleteAddressHeading]: " Confirm delete address",
  // payment details
  [localizationKeys.paymentMethod]: "Payment Method",
  [localizationKeys.backToHome]: "Back to home",
  [localizationKeys.yourPurchaseHasBeenSuccessfullyCompleted]:
    "Your purchase has been successfully completed",
  [localizationKeys.yourDepositHasBeenSuccessfullyTransferredAndYourAuctionIsActiveNow]:
    "Your deposit has been successfully transferred and your auction is active now",
  [localizationKeys.paymentSuccess]: "Payment success",
  [localizationKeys.yourBidHasBeenSuccessfullyPlaced]:
    "Your bid has been successfully placed",
  [localizationKeys.viewBids]: "View Bids",
  [localizationKeys.viewPurchased]: "View Purchased",
  [localizationKeys.viewAuction]: "View Auctions",
  [localizationKeys.viewProducts]: "View Products",
  [localizationKeys.view]: "View",
  // profile
  [localizationKeys.online]: "Online",
  [localizationKeys.logout]: "Logout",
  [localizationKeys.profileSettings]: "Profile Settings",
  [localizationKeys.completeYourProfileToMakeYourActionsEasier]:
    "Complete your profile to make your actions easier",
  [localizationKeys.completeNowMasg]:
    "Your account currently offers access to updates, saved items, sale  details, and other features. To bid, buy and sell with Alle-tre,   kindly take a moment to fill out your profile information.",
  [localizationKeys.completeNow]: " Complete Now",
  [localizationKeys.editPhoto]: "Edit Photo",
  [localizationKeys.uploadPhoto]: "Upload Photo",
  [localizationKeys.dropYourPhotoHereToInstantlyUploadIt]:
    " Drop your photo here to instantly upload it",
  [localizationKeys.save]: "Save",
  [localizationKeys.selectAfile]: "Select a file",
  [localizationKeys.edit]: "Edit",
  [localizationKeys.contactUs]: "Contact Us",
  [localizationKeys.editUserName]: "Edit User name",
  [localizationKeys.personalDetails]: "Personal Details",
  [localizationKeys.userName]: "User Name",
  [localizationKeys.changePassword]: "Change Password",
  [localizationKeys.editPassword]: "Edit Password",
  [localizationKeys.oldPassword]: "Old Password",
  [localizationKeys.newPassword]: "new Password",
  [localizationKeys.verified]: "Verified",
  [localizationKeys.eMail]: "E-Mail",
  [localizationKeys.phoneNumber]: "Phone Number",
  [localizationKeys.editPhoneNumber]: "Edit Phone Number",
  [localizationKeys.loginService]: "Login Service",
  [localizationKeys.loginServiceMaseg]:
    "Your Alletre account does not have an external login service. Connect accounts now for quick & secure access.",
  [localizationKeys.connected]: "Connected",
  [localizationKeys.connectedWithApple]: "Connected with Apple",
  [localizationKeys.connectWithGoogle]: "Connect with Google",
  [localizationKeys.connectWithFacebook]: "Connect with Facebook",
  [localizationKeys.addressBook]: "Address Book",
  [localizationKeys.addressBookmasg]:
    "Manage your addresses for a quick and easy checkout experience",
  [localizationKeys.default]: "Default",
  [localizationKeys.delete]: "Delete",
  [localizationKeys.makeDefault]: " Make Default",
  [localizationKeys.the]: " The",
  [localizationKeys.yourWatchlist]: " Your Watchlist",
  [localizationKeys.thereAreNoWatchlistYet]: "  There are no Watchlist yet.",
  [localizationKeys.ChangedDefaultAdrress]: " Changed Default Adrress",
  [localizationKeys.invalidLocationId]: "Invalid location ID",
  [localizationKeys.accessBlocked]: "Access Blocked/Account Deleted",
  [localizationKeys.yourAccountIsBlockedByAdminPleaseContactSupport]:
    "Your account is blocked or deleted by admin. Please contact support.",
  // myauctions
  [localizationKeys.createNow]: "Create Now",
  [localizationKeys.thereAreNoAuctionsCurrentlyMakeYourFirstAuctionRightAway]:
    "There are no auctions currently. Make your first auction right away.",
  [localizationKeys.totalAuctions]: "Total Auctions",
  [localizationKeys.active]: "Active",
  [localizationKeys.cancelled]: "Cancelled",
  [localizationKeys.total]: "Total",
  [localizationKeys.totalActive]: "Total Active Auctions..",
  [localizationKeys.totalCancel]: "Total Cancel Auctions..",
  [localizationKeys.youCanCreateOne]: "You can create one",
  [localizationKeys.oppsActive]: "Ops, there are no active auctions yet.",
  [localizationKeys.oppsCancelled]: "Ops, there are no cancelled auctions yet.",
  [localizationKeys.lastestPrice]: "Lastest Price",
  [localizationKeys.startingPrice]: "Starting Price",
  [localizationKeys.startingDate]: "Starting Date",
  [localizationKeys.pendingDeposit]: "Pending Deposit",
  [localizationKeys.purchasePrice]: " Purchase Price",
  [localizationKeys.endingDate]: " Ending Date",
  [localizationKeys.endingTime]: " Ending Time",
  [localizationKeys.totalScheduled]: "Total Scheduled Auctions..",
  [localizationKeys.opsScheduled]: "Ops, there are no Scheduled auctions yet.",
  [localizationKeys.totalDraft]: "Total Draft Auctions..",
  [localizationKeys.opsDraft]: "Ops, there are no expired auctions yet.",
  [localizationKeys.totalSold]: "Total Sold Auctions..",
  [localizationKeys.opsSold]: "Ops, there are no sold auctions yet.",
  [localizationKeys.totalPending]: "Total Pending Auctions..",
  [localizationKeys.opsPending]: "Ops, there are no sold pending yet.",
  [localizationKeys.totalExpired]: "Total Expired Auctions...",
  [localizationKeys.opsExpired]: "Ops, there are no Expired auctions yet.",
  [localizationKeys.watingForPaymentAuctions]:
    "Waiting For Payment Auctions...",
  [localizationKeys.cancelTheAuction]: "Cancel the auction?",
  [localizationKeys.Warning]: "Warning",
  [localizationKeys.PaymentSelection]: "Payment selection",
  [localizationKeys.walletPayment]: "Wallet Payment",
  [localizationKeys.BankTransfer]: "Bank Transfer",
  [localizationKeys.BankTransferDetails]: "Bank Transfer Details",
  [localizationKeys.onlinePayment]: "Online Payment",
  [localizationKeys.WhichPaymentMethodWouldYouLikeToSelect]:
    "Which payment method would you like to select?",
  [localizationKeys.OK]: "OK",
  [localizationKeys.didYouSendTheItemForDelivery]:
    "Did you send the item for delivery?",
  [localizationKeys.sendMessageToBuyer]: "Send a message to buyer ",
  [localizationKeys.Message]: "Message",
  [localizationKeys.CancellAuctionWarningMessageWithBidders]:
    "Cancelling the auction will cause to lose your security deposit..!",
  [localizationKeys.CancellAuctionWarningMessageWithZeroBidders]:
    "Are you sure to cancel the auction..?",
  [localizationKeys.ContinueToCancel]: "Continue to cancel ?",
  [localizationKeys.discontinue]: "Discontinue",
  [localizationKeys.YouSuccessfullyCancelledTheAuction]:
    "Succefully cancelled the auction..!",
  [localizationKeys.YouHaveSuccessfullyNotifiedTheWinner]:
    "You have successfully notified the winner",
  // mybids
  [localizationKeys.Youarenotbiddingonanyitems]:
    "You are not bidding on any items.",
  [localizationKeys.Checkactiveauctionstostartbidding]:
    "Check active auctions to start bidding",
  [localizationKeys.inProgress]: "In Progress",
  [localizationKeys.waitingForDelivery]: "Waiting for delivery",
  [localizationKeys.completed]: "Completed",
  [localizationKeys.ThereIsNoBidsYetInProgressAuctionsRightNow]:
    "There is no bids yet in progress auctions right now",
  [localizationKeys.youHaveNotPlacedAnyBidsAtThisTime]:
    "You have not placed any bids at this time",
  [localizationKeys.startBidding]: "Start bidding",
  [localizationKeys.startLisitng]: "Start listing",
  [localizationKeys.thereAreNoActiveBidsAtTheMomentPlaceYourFirstBidNow]:
    "There are no active bids at the moment. Place your first bid now!",
  [localizationKeys.thereAreNoListedProductsAtTheMomentListYouFirstProductNow]:
    "There are no listed products at the moment. List your first product now!",
  [localizationKeys.increaseBid]: "Increase Bid",
  [localizationKeys.inPrsubmitNewBidogress]: "Submit new bid",
  [localizationKeys.ThereIsNoBidsYetPendingAuctionsRightNow]:
    "There is no bids yet pending auctions right now",
  [localizationKeys.completePayment]: "Complete payment",
  [localizationKeys.ThereIsNoBidsYetOnWaitingForDeliveryAuctionsRightNow]:
    "There is no bids yet on waiting for delivery auctions right now",
  [localizationKeys.confirmDelivery]: "Confirm delivery",
  [localizationKeys.deliveryByCompany]: "Delivery by company",
  [localizationKeys.AnyCompliants]: "Any complaints ?",
  [localizationKeys.sellerContactDetails]: "Seller contact details",
  [localizationKeys.buyerContactDetails]: "Buyer contact details",
  [localizationKeys.unSubscribe]: "Unsubscribe",
  [localizationKeys.ThereIsNoBidsYetExpiredAuctionsRightNow]:
    "There is no bids yet expiredauctions right now",
  [localizationKeys.ThereIsNoBidsyetCompletedAuctionsRightNow]:
    "There is no bids yet completed auctions right now",
  [localizationKeys.ThereIsNoBidsyetCancelledAuctionsRightNow]:
    "There is no bids yet cancelled auctions right now",
  [localizationKeys.submitNewBid]: "Submit New Bid",
  [localizationKeys.AnyObjection]: "Any Objections?",
  [localizationKeys.AllMyBids]: "All My Bids",
  [localizationKeys.AllMyProducts]: "All My Products",
  [localizationKeys.InProgress]: "In Progress",
  [localizationKeys.outOfStock]: "Out Of Stock",
  [localizationKeys.Pending]: "Pending",
  [localizationKeys.completedAuction]: "Completed Auction",
  [localizationKeys.cancelledAuctions]: "Cancelled Auctions",
  //delevery Issue Report Modal
  [localizationKeys.NotDeliveredYet]: "Not Delivered yet?",
  [localizationKeys.ProductIsNotAsShownInPicture]:
    "Product not as shown in picture?",
  [localizationKeys.DoesProductHaveAnyIssueWhichIsNotMentionedInTheDescription]:
    "Does product have any issue which is not mentioned in the description?",
  [localizationKeys.Others]: "Others?",
  [localizationKeys.tellUsYourProblem]: "Tell us your problem..?",
  [localizationKeys.Description]: "Description",
  [localizationKeys.uploadImages]: "Upload Images",
  [localizationKeys.YouCanSelectMultipleImagestogether]:
    "You can select multiple images together",
  [localizationKeys.Submit]: "Submit",
  [localizationKeys.PleaseSelectAnyOption]: "Please Select any option..!",
  [localizationKeys.PleaseGiveTheDescription]: "Please give the description..!",
  [localizationKeys.SorryYourSubmissionHasFailedPleaseTryAgainLater]:
    "Sorry, Your submission has failed. please try again later..!",
  [localizationKeys.ThankYouForYourSubmission]:
    "Thank you for your submission..!",
  //  Purchased
  [localizationKeys.Purchased]: "Purchases",
  [localizationKeys.yourPurchased]: "Your purchases",
  [localizationKeys.ThereAreNoPurchasedYet]: "There are no purchases yet",

  // details
  [localizationKeys.reviews]: "Reviews",
  [localizationKeys.timeLeft]: "Time Left",
  [localizationKeys.submitBid]: "Submit Bid",
  [localizationKeys.description]: "Description",
  [localizationKeys.series]: "Series",
  [localizationKeys.bidderName]: "Bidder Name",
  [localizationKeys.biddingEndingTime]: "Bidding Ending Time",
  [localizationKeys.lastBidAmount]: "Last Bid Amount",
  [localizationKeys.totalBidders]: "Total Bidders",
  [localizationKeys.biddingTime]: "Bidding Time",
  [localizationKeys.bidAmount]: "Bid Amount",
  [localizationKeys.startingBidAmount]: "Starting Bid Amount",
  [localizationKeys.currentBid]: "Current Bid",
  [localizationKeys.YourMaximumBidAllowedForThisAuctionIsAED]:
    "Your Maximum Bid Allowed For This Auction Is AED ",
  [localizationKeys.submitValueIsRequiredAndMustBeBiggerThanCurrentBid]:
    "Submit value is required and must be bigger than current Bid",
  [localizationKeys.yourAddNewSubmitValueSuccessfully]:
    "New bid submitted successfully",
  [localizationKeys.congratulationsOnYourFirstBid]:
    "Congratulations On Your First Bid",
  [localizationKeys.editBid]: "Edit Bid",
  [localizationKeys.pay]: "Pay",
  [localizationKeys.deposit]: "Deposit",
  [localizationKeys.YouAreAboutToPlaceBidFor]:
    "You are about to place a Bid For",
  [localizationKeys.InThisAuctionPleaseNoticeThatYouWillNeedToPayA]:
    "in this auction please notice that you will need to pay a ",
  [localizationKeys.ofThePriceAsADepositOnlyOnceSoYouCanFreelyEnjoyBidding]:
    " of the price as a deposit only once so you can freely enjoy bidding",
  [localizationKeys.startingTime]: "Starting Time",
  [localizationKeys.endingPrice]: "Ending Price",
  [localizationKeys.viewAll]: "View All",
  // tab details
  [localizationKeys.shippingPolicy]: "Shipping Policy",
  [localizationKeys.payment]: "Payment",
  [localizationKeys.feedback]: "Feedback",
  [localizationKeys.aboutTheBrand]: "About The Brand",

  // err
  [localizationKeys.required]: "Required",
  [localizationKeys.YouHaveToIncreaseTheBiddingRateNotingThatTheLastBiddingWasInValue]:
    "You have to increase the bidding rate noting that the last bidding was in value",
  [localizationKeys.makeSureThatYouChooseItemConditionValue]:
    "Make sure that you choose item condition value",
  [localizationKeys.makeSureThatYouChooseAtLeastThreeOrMorePhotos]:
    "Make sure that you choose at least three or more photos",
  [localizationKeys.oops]:
    "oops, sorry something with wrong please make sure everything is correct and try again",
  // success
  [localizationKeys.thisAuctionDeleteFromWatchListBeenSuccessfully]:
    "Auction removed from Watchlist successfully",
  [localizationKeys.thisAuctionAddToWatchListBeenSuccessfully]:
    "Added to your Watchlist successfull",
  [localizationKeys.thePasswordHasBeenEditSuccessfully]:
    "he Password Has Been Edit Successfully",
  [localizationKeys.hasBeenDeleteSuccessfully]: "has been delete successfully",
  [localizationKeys.hasBeenMakeDefaultSuccessfully]:
    "has been Make Default successfully",
  [localizationKeys.imageUpdatedSuccessfully]: "Image updated successfully",
  [localizationKeys.nameHasBeenEditSuccessfully]:
    "Name has been edit successfully",
  [localizationKeys.yourAuctionSuccessfullySavedAsDraft]:
    "Your auction successfully saved as draft",
  [localizationKeys.yourAuctionIsCreatedSuccess]:
    "Your auction has been created successfully",
  [localizationKeys.yourProductIsSuccessfullyListed]:
    "Your product is successfully listed",
  [localizationKeys.makeSureThatYouChooseTheAuctionLocationOrCreateAnotherOne]:
    "Make sure that you choose the auction location or create another one",
  //wallet
  [localizationKeys.Wallet]: "Wallet",
  [localizationKeys.notifications]: "Notifications",
  [localizationKeys.ThereAreNoTransactionYet]:
    "There are no transactions yet..!",
  [localizationKeys.ThereAreNoNotificationsYet]:
    "There are no notifications yet..!",
  [localizationKeys.ThereAreNoBankAccountAddedYet]:
    "No bank account added yet..!",
  [localizationKeys.accountHolderName]: "Account Holder Name :",
  [localizationKeys.bankName]: "Bank Name :",
  [localizationKeys.bankAccountNumber]: "Bank Account Number :",
  [localizationKeys.IBANnumber]: "IBAN Number :",
  [localizationKeys.WalletBalance]: "Wallet Balance ",
  [localizationKeys.Withdraw]: "Withdraw",
  [localizationKeys.Date]: "Date",
  [localizationKeys.Description]: "Description",
  [localizationKeys.Withdrawals]: "Withdrawals",
  [localizationKeys.Deposits]: "Deposits",
  [localizationKeys.Balance]: "Balance",
  [localizationKeys.YourBankDetails]: "Your Bank Details",
  [localizationKeys.AddNewBankAccount]: "Add new bank account",
  [localizationKeys.EnterTheAmount]: "Enter the amount",
  [localizationKeys.Amount]: "Amount",
  [localizationKeys.AmountMustBeMoreThan1AED]: "Amount must be more than AED 1",
  [localizationKeys.GoBack]: "Go back",
  [localizationKeys.SubmitWithdrawalRequest]: "Submit withdrawal request",
  [localizationKeys.AddAccount]: "Add Account",
  [localizationKeys.WithDrawalSuccessMessage]:
    "Success! Your withdrawal request has been processed successfully. Your funds are on their way, and you’ll receive them shortly. Thank you for using our service!",
  [localizationKeys.addAccount]: "Add account",
};

export default en;
