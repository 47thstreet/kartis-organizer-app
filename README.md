# Kartis Organizer App

Event organizer companion app for the Kartis nightlife platform. Manage events, scan tickets, monitor live stats, and track promoter performance from your phone.

## Tech Stack

- **Runtime**: Expo SDK 55 / React Native 0.83
- **Navigation**: React Navigation 7 (bottom tabs + native stack)
- **Charts**: react-native-chart-kit + react-native-svg
- **Camera**: expo-camera + expo-barcode-scanner (QR ticket scanning)
- **Language**: TypeScript 5.9

## Screens

| Screen | Description |
|--------|-------------|
| `DashboardScreen` | Overview metrics: ticket sales, revenue, attendance |
| `EventsScreen` | List and manage upcoming/past events |
| `CheckInScreen` | QR code scanner for ticket check-in at the door |
| `AnalyticsScreen` | Charts for sales trends, demographics, revenue |
| `LiveStatsScreen` | Real-time attendance and door metrics during events |
| `OrdersScreen` | Ticket orders and transaction history |
| `PromotersScreen` | Promoter performance tracking and commissions |
| `SettingsScreen` | Account settings and notification preferences |
| `VenueMapScreen` | Interactive venue map with section layout |
| `WebhooksScreen` | Configure webhook integrations for external services |

## Project Structure

```
src/
  screens/          # 10 screen components
  components/       # Shared UI components
  navigation/       # Tab and stack navigators
  services/         # API client (connects to Kartis backend)
  types/            # TypeScript interfaces
```

## Getting Started

```bash
# Install dependencies
npm install

# Start Expo dev server
npm start

# Run on iOS simulator
npm run ios

# Run on Android emulator
npm run android
```

## Environment

The app connects to the Kartis API backend. Configure the API base URL in the services layer:

| Variable | Description |
|----------|-------------|
| `KARTIS_API_URL` | Kartis backend API endpoint |

## Related

- [kartis-astro](../kartis-astro) -- Backend platform and web UI
- [tbpl](../tbpl) -- Promoter league and gamification
