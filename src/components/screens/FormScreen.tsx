// src/screens/FormScreen.tsx
import React, {useState} from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {TextInput, Button, Menu, Provider} from 'react-native-paper';
import DatePicker from 'react-native-date-picker';
import Icon from 'react-native-vector-icons/MaterialIcons';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import RNPrint from 'react-native-print';

export default function FormScreen() {
  const [damageNumber, setDamageNumber] = useState<string>('');
  const [selectedDamageType, setSelectedDamageType] =
    useState<string>('Schadenart');
  const [menuVisibleDamageType, setMenuVisibleDamageType] =
    useState<boolean>(false);
  const [insuranceType, setInsuranceType] = useState<string>('');
  const [date, setDate] = useState<Date>(new Date());
  const [openDatePicker, setOpenDatePicker] = useState<boolean>(false);
  const [anrede, setAnrede] = useState<string>('Anrede');
  const [menuVisibleAnrede, setMenuVisibleAnrede] = useState<boolean>(false);
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [zipCode, setZipCode] = useState<string>('');
  const [city, setCity] = useState<string>('');

  const damageTypes: string[] = ['Unfall', 'Diebstahl', 'Schäden', 'Feuer'];
  const anreden: string[] = ['Herr', 'Frau'];

  const unifiedInputStyle = {
    marginBottom: 16,
    borderRadius: 5, // Abgerundete Ecken
    borderColor: '#cccccc', // Gleicher Rahmen für alle Felder
    backgroundColor: 'white',
    paddingVertical: 8, // Einheitlicher Innenabstand
    paddingHorizontal: 12,
    fontSize: 16, // Einheitliche Schriftgröße
  };

  const formatDate = (date: Date) => {
    // DD.MM.YYYY Format
    return date.toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  async function generatePDF() {
    // HTML-Struktur für das PDF-Dokument
    const htmlContent = `
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; }
          h1 { text-align: center; }
          p { margin: 0; padding: 4px 0; }
        </style>
      </head>
      <body marginwidth="50" marginheight="100" topmargin="100" leftmargin="50">
        <h2>Blanko-Auftrag</h2>
        <p><strong>Schadensnummer:</strong> ${damageNumber}</p>
        <p><strong>Schadenart:</strong> ${selectedDamageType}</p>
        <p><strong>Versicherungszweig:</strong> ${insuranceType}</p>
        <p><strong>Datum:</strong> ${formatDate(date)}</p>
        <hr>
        <h3>Kontaktdaten</h3>
        <p>${anrede} ${title} ${firstName} ${lastName}</p>
        <p>${address}</p>
        <p>${zipCode} ${city}</p>
      </body>
    </html>
    `;

    // PDF-Optionen
    let options = {
      html: htmlContent,
      fileName: 'Blanko_Auftrag',
      directory: 'Documents',
    };

    // PDF generieren
    try {
      let file = await RNHTMLtoPDF.convert(options);
      console.log('PDF Path:', file.filePath);

      // Überprüfen, ob filePath existiert
      if (file.filePath) {
        // PDF-Druckvorschau anzeigen
        await RNPrint.print({filePath: file.filePath});
      } else {
        console.error('Fehler: Kein Dateipfad vorhanden');
      }
    } catch (error) {
      console.error('Fehler beim Generieren oder Drucken des PDFs:', error);
    }
  }

  return (
    <Provider>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Header-Container */}
        <View style={styles.headerContainer}>
          <Text style={styles.header}>Blanko-Auftrag</Text>
          <TouchableOpacity onPress={generatePDF} style={styles.pdfButton}>
            <Icon name="picture-as-pdf" size={24} color="black" />
          </TouchableOpacity>
        </View>

        {/* Schadensnummer */}
        <TextInput
          label="Schadensnummer"
          value={damageNumber}
          onChangeText={(text: string) => setDamageNumber(text)}
          style={unifiedInputStyle}
          mode="outlined"
        />

        {/* Schadenart */}
        <Menu
          visible={menuVisibleDamageType}
          onDismiss={() => setMenuVisibleDamageType(false)}
          anchor={
            <Button
              mode="outlined"
              onPress={() => setMenuVisibleDamageType(true)}
              style={unifiedInputStyle}>
              <Text style={styles.buttonText}>{selectedDamageType}</Text>
            </Button>
          }>
          {damageTypes.map(type => (
            <Menu.Item
              key={type}
              onPress={() => {
                setSelectedDamageType(type);
                setMenuVisibleDamageType(false);
              }}
              title={type}
            />
          ))}
        </Menu>

        {/* Versicherungszweig */}
        <TextInput
          label="Versicherungszweig"
          value={insuranceType}
          onChangeText={(text: string) => setInsuranceType(text)}
          style={unifiedInputStyle}
          mode="outlined"
        />

        {/* Datumsauswahl */}
        <Button
          mode="outlined"
          onPress={() => setOpenDatePicker(true)}
          style={unifiedInputStyle}>
          <Text style={styles.buttonText}>{formatDate(date)}</Text>
        </Button>
        <DatePicker
          modal
          open={openDatePicker}
          date={date}
          mode="date"
          onConfirm={(newDate: Date) => {
            setDate(newDate);
            setOpenDatePicker(false);
          }}
          onCancel={() => setOpenDatePicker(false)}
        />

        {/* Kontaktdaten Überschrift */}
        <Text style={styles.subHeader}>Kontaktdaten</Text>

        {/* Anrede */}
        <Menu
          visible={menuVisibleAnrede}
          onDismiss={() => setMenuVisibleAnrede(false)}
          anchor={
            <Button
              mode="outlined"
              onPress={() => setMenuVisibleAnrede(true)}
              style={unifiedInputStyle}>
              <Text style={styles.buttonText}>{anrede}</Text>
            </Button>
          }>
          {anreden.map(s => (
            <Menu.Item
              key={s}
              onPress={() => {
                setAnrede(s);
                setMenuVisibleAnrede(false);
              }}
              title={s}
            />
          ))}
        </Menu>

        {/* Titel */}
        <TextInput
          label="Titel"
          value={title}
          onChangeText={(text: string) => setTitle(text)}
          style={unifiedInputStyle}
          mode="outlined"
        />

        {/* Vorname und Nachname */}
        <TextInput
          label="Vorname"
          value={firstName}
          onChangeText={(text: string) => setFirstName(text)}
          style={unifiedInputStyle}
          mode="outlined"
        />
        <TextInput
          label="Nachname"
          value={lastName}
          onChangeText={(text: string) => setLastName(text)}
          style={unifiedInputStyle}
          mode="outlined"
        />

        {/* Adresse, PLZ, Ort */}
        <TextInput
          label="Straße/Hausnummer"
          value={address}
          onChangeText={(text: string) => setAddress(text)}
          style={unifiedInputStyle}
          mode="outlined"
        />
        <TextInput
          label="PLZ"
          value={zipCode}
          onChangeText={(text: string) => setZipCode(text)}
          style={unifiedInputStyle}
          mode="outlined"
        />
        <TextInput
          label="Ort"
          value={city}
          onChangeText={(text: string) => setCity(text)}
          style={unifiedInputStyle}
          mode="outlined"
        />
      </ScrollView>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: 'white',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between', // Lässt Text und Button auf entgegengesetzten Seiten
    alignItems: 'center', // Zentriert beides vertikal
    marginBottom: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  pdfButton: {
    paddingHorizontal: 8, // Optionaler Innenabstand
  },
  subHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 16,
  },
  buttonText: {
    color: 'black',
    textAlign: 'left',
    fontSize: 16,
  },
});
