<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Creative Communications</title>
	<link rel="stylesheet" href="css/style.css" />
	<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-rbsA2VBKQhggwzxH7pPCaAqO46MgnOM80zW1RWuH61DGLwZJEdK2Kadq2F9CUG65" crossorigin="anonymous">
</head>

<?php
    session_start();
?>

<body>

    <header class="pan-header mb-4">
		<div id="header-container" class="container-fluid align-middle">
			<!-- Small header for <576px. Uses flebox column to stack wordmarks. Display toggled at SM/MD Breakpoint -->  
			<div id="small-header-wrapper" class="row pt-3">
				<div class="col-3">
					<a class="block-w-logo" alt="University of Washington Logo" target="_blank" rel="noopener" href="https://www.uw.edu"></a>
				</div>
				<div class="col-9 d-flex flex-column pt-2">
					<div class="col-12 d-flex justify-content-end pb-1">
						<a class="uw-wordmark" alt="University of Washington Wordmark" target="_blank" rel="noopener" href="https://www.uw.edu"></a>
					</div>
					<div class="col-12 d-flex justify-content-end">	
						<a class="c2-wordmark" alt="Creative Communications Wordmark" target="_blank" rel="noopener" href="https://www.uw.edu"></a>
					</div>
				</div>
			</div><!-- #small-header -->
			<!-- Header for >= 576px. Doesn't use flex column. Display toggled at MD/SM Breakpoint -->
			<div id="header-wrapper" class="row px-lg-5">
				<div class="col-12 d-inline-block">
					<a class="block-w-logo" target="_blank" rel="noopener" href="https://www.uw.edu"></a>
					<a class="uw-wordmark" target="_blank" rel="noopener" href="https://www.uw.edu"></a>
					<a class="c2-wordmark" target="_blank" rel="noopener" href="https://finance.uw.edu/c2/"></a>
				</div>
			</div><!-- #header-wrapper -->
		</div><!-- #header-container -->
		<h1 class="offpage">Creative Communications Digital Storefront Worktag Submission</h1> <!-- Included for proper semantics but moved waaaay out of the viewport to be 'hidden' without really hiding -->
	</header>

    <section id="worktag-form-container" class="container">
        <div class="row">
            <form name="frmWorktags" method="POST" id="frmWorktags" action='' autocomplete="off">
                <div class="col-12 col-md-10 offset-md-1 col-xxl-8 offset-xxl-2 mb-3">
                    
					<fieldset id="constructor-fieldset" class="pan-fieldset px-5 pb-4">
                        <legend>Worktags</legend>

                            <!-- Company -->
                            <div class="row">
                                <div class="col-lg-4 col-12"><!-- Label Col-->
                                    <label for="companySelect" class="form-label">Company</label>
                                </div>
                                <div class="col-lg-8 col-12"><!-- Dropdown/Input Col -->
                                    <div class="row">
                                        <div class="col-12">
                                            <select id="companySelect" name="companySelect" onchange="addCompanyTag()" class="form-select">
                                                <option selected="true" disabled>---</option>
                                                <option value="UW1861">UW1861</option>
                                                <option value="SOM">SOM</option>
                                                <option value="ALNW">ALNW</option>
                                                <option value="FHCC">FHCC</option>
                                                <option value="HMC">HMC</option>
                                                <option value="PBI">PBI</option>
                                                <option value="UWMPC">UWMPC</option>
                                                <option value="UWMSS">UWMSS</option>
                                                <option value="UWP">UWP</option>
                                                <option value="CHCR">CHCR</option>
                                                <option value="MT">MT</option>
                                                <option value="UWAA">UWAA</option>
                                                <option value="UWF">UWF</option>
                                                <option value="VMC">VMC</option>
                                                <option value="WBRP">WBRP</option>
                                            </select>
                                        </div>
                                    </div><!-- #row (inner) -->
                                </div><!-- #col (Company) -->
                                <hr class="tag-divide">
                            </div><!-- #row (company) -->

                            <!-- Driver -->
                            <div class="row">
                                <div class="col-lg-4 col-12">
                                    <label for="driverSelect" class="form-label">Driver Type</label>
                                </div>
                                <div class="col-lg-8 col-12">
                                    <div class="row">
                                        <div class="col-md-5 col-9">
                                            <select id="driverSelect" name="driverSelect" onchange="driverTagSelect()" disabled="true" class="form-select">
                                                <option selected="true" disabled>---</option>
                                                <option value="CC">Cost Center</option>
                                                <option value="PG">Program</option>
                                                <option value="GR">Grant Award</option>
                                                <option value="GR">Grant Standalone</option>
                                                <option value="GF">Gift</option>
                                                <option value="PJ">Project</option>
                                            </select>
                                        </div>
                                        <div class="col-md-5 col-9">
                                            <input name="driverInput" id="driverInput" type="text" disabled="true" maxlength="8" size="10" onkeyup="driverTagInput()" class="form-control">
                                        </div>
                                        <div class="col-md-2 col-3">
                                            <input type="button" value="Add" id="addDriverBtn" name="addDriverBtn" disabled="true" onclick="addDriverTag()" class="btn btn-outline-dark c2-btn ml-2">
                                        </div>
                                        <div class="col-md-5 col-9">
                                            <select hidden="true" name="resourceSelect" id="resourceSelect" disabled="true" readonly class="Resource form-select">
                                                <option selected="true" value="RS">Resource</option>
                                            </select>
                                        </div>
                                        <div class="col-md-5 col-9">
                                            <input hidden="true" name="resourceInput" id="resourceInput" disabled="true" maxlength="8" size="10" onkeyup="resourceTagInput()" class="form-control">
                                            
                                        </div>
                                        <div class="col-md-2 col-3">
                                            <input type="button" value="Add" id="addResourceBtn" name="addResourceBtn" hidden="true" disabled="true" onclick="addResourceTag()" class="btn btn-outline-dark c2-btn ml-2">
                                        </div>
                                        
                                    </div>
                                </div>
                                <hr class="tag-divide">
                            </div><!-- row (driver) -->

                            <!-- Optional -->
                            <div class="row">
                                <div class="col-lg-4 col-12">
                                    <label for="optOptionalWorktagsList" class="form-label">Optional Type</label>
                                </div>
                                <div class="col-lg-8 col-12">
                                    <div class="row">
                                        <div class="col-md-5 col-9">
                                            <select name="optionalSelect" id="optionalSelect" onchange="optionalTagSelect()" disabled="true" class="form-select">
                                                <option selected="true" disabled>---</option>	
                                                <option value='AC'>Activity</option>
                                                <option value='AS'>Assignee</option>
                                                <option value='GR'>Grant Standalone</option>
                                                <option value='IN'>Institutional Initiative</option>
                                                <option value='PY'>Payor</option>
                                                <option value='PG'>Program</option>
                                                <option value='WO'>Workorder</option>
                                            </select>
                                        </div>
                                        <div class="col-md-5 col-9">
                                            <input name="optionalInput" id="optionalInput" size='10' onkeyup="optionalTagInput()" maxlength="8" disabled="true" class="form-control">
                                        </div>
                                        <div class="col-md-2 col-3">
                                            <input type="button" name="addOptionalBtn" id="addOptionalBtn" value="Add" onclick="addOptionalTag()" disabled="true" class="btn btn-outline-dark c2-btn ml-2">
                                        </div>
                                    </div>
                                </div>
                                
                            </div><!-- row (driver) -->
                    </fieldset>

                    <div class="row">
                        <div class="col-12 col-xxl-10 offset-xxl-1">
                            <p class="text-center">
                                Company tag and Driver tag are required. Click the Company tag button to reset the entire Worktag string. Click a Driver or Optional tag button to remove it.
                            </p>
                        </div>
                    </div>

                    <!-- Complete Worktags -->
                    <fieldset class="pan-fieldset px-5 pb-4">
                        <legend>Complete Worktag String</legend>
                        <div class="row my-2" id="companyRow" hidden="true">
                            <div class="col-lg-2 col-12 justify-content-lg-end justify-content-start mr-4 d-flex align-items-center py-2 py-lg-0">
                                <span>Company</span>
                            </div>
                            <div class="col-lg-10 col-12">
                                <div class="btn-group btn-group btn-group-wrap" id="companyButtonGroup">
                                    
                                </div>
                            </div>
                        </div>
                        <div class="row my-2" id="driverRow" hidden="true">
                            <div class="col-lg-2 col-12 justify-content-lg-end justify-content-start mr-4 d-flex align-items-center py-2 py-lg-0">
                                <span>Driver</span>
                            </div>
                            <div class="col-lg-10 col-12">
                                <div class="btn-group btn-group btn-group-wrap" id="driverButtonGroup">

                                </div>
                            </div>
                        </div>
                        <div class="row my-2" id="optionalRow" hidden="true">
                            <div class="col-lg-2 col-12 justify-content-lg-end justify-content-start mr-4 d-flex align-items-center py-2 py-lg-0">
                                <span>Optional</span>
                            </div>
                            <div class="col-lg-10 col-12">
                                <div class="btn-group btn-group btn-group-wrap" id="optionalButtonGroup">

                                </div>
                            </div>
                        </div>

                        <!-- OLD -->
                        <!-- Error Message Row -->
						<div class="row">
							<div class="col-12 d-flex justify-content-center error-container" id="error_msg">
								
							</div>
						</div><!-- #error message row -->

                        <div class="row mt-4">
                            <div class="col-12 d-flex justify-content-center">
                                <input disabled="true" class="form-control" name ='FieldValue' id='FieldValue' value=''>
                            </div>
                        </div>
                        <div class="row mt-4">
                            <div class="col-12 d-flex justify-content-center">
                                <input id="submitBtn" name="submitBtn" type="button" value="Copy Worktag String" disabled="true" onclick="submitWorktags()" class="btn btn-outline-dark c2-btn">
                            </div>
                        </div>         

                    </fieldset>

                </div>
            </form>
        </div>
    </section>



    <footer class="pan-footer"> <!-- footer to match main site -->
		<div class="container">
			<div class="row">
				<div class="col-12">
					<p class="text-white text-center">UW Creative Communications  /  3900 Seventh Ave N.E.  /  Box 359000  /  Seattle, Washington 98195  /  206.543.5680  /  206.685.3411 fax</p>
					<p class="text-white text-center"><a href="c2info@uw.edu">Email Us</a>  |  <a href="https://finance.uw.edu/c2/directory">Directory</a>  |  <a href="https://finance.uw.edu/c2/sitemap">Sitemap</a>  |  <a href="http://washington.edu/maps/?PSV">Map</a>  |  <a href="https://finance.uw.edu/c2/comments">Tell Us What You Think</a>  |  <a href="http://www.washington.edu/online/privacy/">Privacy</a>  |  <a href="http://www.washington.edu/online/terms/">Terms</a>  |  <a href="https://finance.uw.edu/Shibboleth.sso/Login?target=https%3A%2F%2Ffinance.uw.edu%2Fc2%2F%3Fq%3Dshib_login%2Fuser%26shib_token%3D1">Login</a></p>
					<p class="text-white text-center">UW Creative Communications is a division of <a href="https://finance.uw.edu/">Finance & Administration</a></p>
				</div>
			</div>
		</div>
	</footer><!-- #footer -->


	<!-- Checkout script + header container script + Bootstrap CDN imports + sortableJS -->
	<script type="text/javascript" src="js/scripts.js"></script>
	<script type="text/javascript" src="js/header_container.js"></script> <!-- This script toggles the container class type on #header-container -->
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.4/jquery.min.js"></script>
	<script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.6/dist/umd/popper.min.js" integrity="sha384-oBqDVmMz9ATKxIep9tiCxS/Z9fNfEXiDAYTujMAeBAsjFuCZSmKbSSUnQlmh/jp3" crossorigin="anonymous"></script>
	<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.min.js" integrity="sha384-cuYeSxntonz0PPNlHhBs68uyIAVpIIOZZ5JqeqvYYIcEL727kskC66kF92t6Xl2V" crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/gh/SortableJS/Sortable@1.10.2/Sortable.min.js"></script>


</body>
</html>