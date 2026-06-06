export function Login() {
  return (
  <main id="planner">
		<section>
			<form id="selection">
				E-Mail:
				<p><input type="text" placeholder="M.Mustermann@Muster.de"/></p>
				<label id="Passwort:">Passwort:</label>
					<p><input type="password" id="pwd" placeholder="Passwort"/>
					<button type="button">
					</button>
				</p>
				<a href="resetpassword.html">Forgot your password?</a>
				<button type="submit">LOGIN</button>
                <a href="register.html">Sign-up</a>
			</form>
		</section>
	</main>
  );
}