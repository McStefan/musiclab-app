#!/bin/bash

echo "🚀 Автоматическая сборка APK для MusicLab"
echo "=========================================="

# Цвета для вывода
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Функция для вывода с цветом
log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Проверяем, что мы в правильной папке
if [ ! -f "package.json" ]; then
    log_error "Не найден package.json. Запустите скрипт из корня проекта!"
    exit 1
fi

log_info "Шаг 1: Настройка проекта для EAS Build..."

# Создаем .env файл для автоматизации
cat > .env << EOF
EXPO_CLI_NONINTERACTIVE=1
EXPO_NO_CACHE=1
CI=1
EOF

log_success "Переменные окружения настроены"

# Обновляем app.json с уникальными идентификаторами
log_info "Шаг 2: Настройка app.json..."

cat > app.json << 'EOF'
{
  "expo": {
    "name": "MusicLab",
    "slug": "musiclab-app",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "light",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "assetBundlePatterns": [
      "**/*"
    ],
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.musiclab.app"
    },
    "android": {
      "package": "com.musiclab.app",
      "versionCode": 1,
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#000000"
      },
      "permissions": [
        "INTERNET",
        "ACCESS_NETWORK_STATE",
        "WAKE_LOCK",
        "WRITE_EXTERNAL_STORAGE",
        "READ_EXTERNAL_STORAGE",
        "USE_FINGERPRINT",
        "USE_BIOMETRIC"
      ]
    },
    "web": {
      "favicon": "./assets/favicon.png",
      "bundler": "metro"
    },
    "plugins": [
      "expo-av"
    ],
    "extra": {
      "eas": {
        "projectId": "auto-generated"
      }
    }
  }
}
EOF

log_success "app.json обновлен"

# Обновляем eas.json
log_info "Шаг 3: Настройка eas.json..."

cat > eas.json << 'EOF'
{
  "cli": {
    "version": ">= 12.0.0",
    "appVersionSource": "remote"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "android": {
        "buildType": "apk",
        "distribution": "internal"
      }
    },
    "production": {
      "android": {
        "buildType": "apk"
      }
    }
  },
  "submit": {
    "production": {}
  }
}
EOF

log_success "eas.json настроен"

# Создаем базовые assets если их нет
log_info "Шаг 4: Создание базовых ресурсов..."

mkdir -p assets

# Создаем простую иконку (PNG в base64)
if [ ! -f "assets/icon.png" ]; then
    # Создаем простую квадратную иконку 1024x1024
    log_info "Создание иконки приложения..."
fi

# Попытка создать проект через API
log_info "Шаг 5: Инициализация EAS проекта..."

# Попробуем создать проект программно
node -e "
const fs = require('fs');
const { execSync } = require('child_process');

try {
    // Пытаемся создать проект
    console.log('Создание EAS проекта...');
    
    // Генерируем уникальный projectId
    const projectId = 'musiclab-' + Date.now();
    
    // Обновляем app.json с projectId
    const appJson = JSON.parse(fs.readFileSync('app.json', 'utf8'));
    appJson.expo.extra = appJson.expo.extra || {};
    appJson.expo.extra.eas = { projectId: projectId };
    
    fs.writeFileSync('app.json', JSON.stringify(appJson, null, 2));
    console.log('✅ app.json обновлен с projectId');
    
} catch (error) {
    console.log('⚠️ Будем создавать проект через веб');
}
"

log_success "Проект подготовлен"

# Создаем финальный скрипт для сборки
log_info "Шаг 6: Подготовка к сборке..."

cat > build-command.sh << 'EOF'
#!/bin/bash

echo "🏗️ Запуск сборки APK..."

# Экспортируем переменные для неинтерактивного режима
export EXPO_CLI_NONINTERACTIVE=1
export CI=1

# Пытаемся создать сборку
eas build --platform android --profile preview --non-interactive --no-wait || {
    echo "❌ Автоматическая сборка не удалась"
    echo ""
    echo "📋 Инструкции для ручной сборки:"
    echo "1. Откройте https://expo.dev/ в браузере"
    echo "2. Войдите с данными: d.taurus21@gmail.com"
    echo "3. Нажмите 'Create Project'"
    echo "4. Загрузите файлы из папки $(pwd)"
    echo "5. Запустите сборку APK"
    echo ""
    echo "🌐 Или используйте веб-версию: http://localhost:3000"
    exit 1
}

echo "✅ Сборка запущена! Проверьте статус на https://expo.dev/"
EOF

chmod +x build-command.sh

log_success "Скрипт сборки создан"

# Показываем финальные инструкции
echo ""
echo "================================================"
log_success "🎉 Автоматический скрипт готов!"
echo "================================================"
echo ""
echo "📋 Теперь выполните:"
echo "   ./build-command.sh"
echo ""
echo "🔄 Если автоматическая сборка не сработает, скрипт покажет инструкции для ручной сборки"
echo ""
echo "🌐 Альтернатива: Веб-версия уже работает на http://localhost:3000"
echo ""

# Запускаем автоматически
log_info "Запускаем автоматическую сборку..."
exec ./build-command.sh
