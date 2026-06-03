export function Recipe_selector() {
  return (
  <section>
		<form>
			<label for="rezept">Wähle das Rezept:</label>
			<select name="rezept" id="rezept">
				<option value="Alien DNA Capsule">Alien DNA Capsule</option>
				<option value="Alumium Casing">Aluminium Casing</option>
			</select>
			<label id="menge">Gebe die gewünschte Anzahl ein:</label>
			<p><input type="number" value="1" min="1" max="1000000" id="number"/>/s</p>
			<button type="submit">Berechnen</button>
		</form>
	</section>
	);
}