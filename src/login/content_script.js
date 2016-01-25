import $ from 'jquery';

const ESC = 27;

if($('.menu_guest').length !== 0){
	let loginWnd = $(`<div id="enh__login_outer">
		<div class="enh__login">
			<h3>Login</h3>
			<form class="form-horizontal margin-bottom-40" role="form" action="/login" method="post">
				<div class="form-group form-md-line-input">
					<label for="enh__username" class="col-md-4 control-label">Username/E-Mail</label>
					<div class="col-md-8">
						<input type="text" class="form-control" id="enh__username" name="username"/>
						<div class="form-control-focus"></div>
					</div>
				</div>
				<div class="form-group form-md-line-input">
					<label for="enh__password" class="col-md-4 control-label">Password</label>
					<div class="col-md-8">
						<input type="password" class="form-control" id="enh__password" name="password"/>
						<div class="form-control-focus"></div>
					</div>
				</div>
				<div class="form-group form-md-line-input">
					<div class="col-md-offset-4 col-md-8">
						<div class="md-checkbox-list">
							<div class="md-checkbox">
								<input type="checkbox" id="enh__remember" class="md-check" value="1" name="remember">
								<label for="enh__remember">
									<span></span>
									<span class="check"></span>
									<span class="box"></span>
									Remember </label>
							</div>
						</div>
					</div>
				</div>
				<div class="form-group">
					<div class="col-md-offset-4 col-md-8">
						<button type="submit" class="btn blue">Log in</button>
						<a href="/resetpass" class="btn red">Reset Password</a>
					</div>
				</div>
			</form>
		</div>
	</div>`)
		.appendTo('body');

	loginWnd.click((e) => {
		if(e.target.id == 'enh__login_outer'){
			loginWnd.hide();
		}
	});

	$(window).on('keydown', (e) => {
		if(e.which === ESC){
			loginWnd.hide();
		}
	});

	$('.menu_guest a[href="/login"]').click(() => {
		loginWnd.show();
		return false;
	});
}
