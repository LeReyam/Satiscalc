export function Password_reset(){
	return (
		<section>
			<form id="selection">
				<label title="mail">Bitte geben Sie ihre E-Mail an:</label>
				<p><input type="text" placeholder="M.Mustermann@Muster.de"/></p>
				<button>Passwort zurücksetzen</button>
                <a href="login.html">Zurück zum Login</a>
			</form>
		</section>
	)
}