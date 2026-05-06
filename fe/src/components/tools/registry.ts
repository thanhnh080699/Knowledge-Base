import { UuidGenerator } from "./uuid-generator"
import { TokenGenerator } from "./token-generator"
import { Base64Tool } from "./base64-tool"
import { HashGenerator } from "./hash-generator"
import { UrlEncoder } from "./url-encoder"
import { HtmlEntities } from "./html-entities"
import { PasswordGenerator } from "./password-generator"
import { SlugGenerator } from "./slug-generator"
import { CaseConverter } from "./case-converter"
import { LoremIpsum } from "./lorem-ipsum"
import { TimestampConverter } from "./timestamp-converter"
import { JsonFormatter } from "./json-formatter"
import { ColorConverter } from "./color-converter"
import { JwtDecoder } from "./jwt-decoder"
import { CronBuilder } from "./cron-builder"
import { CryptoTokenGenerator } from "./crypto-token-generator"
import { CryptoHashText } from "./crypto-hash-text"
import { CryptoBcrypt } from "./crypto-bcrypt"
import { CryptoEncryptDecrypt } from "./crypto-encrypt-decrypt"
import { CryptoHmac } from "./crypto-hmac"
import { CryptoRsaKeyGenerator } from "./crypto-rsa-key-generator"
import { CryptoPasswordGenerator } from "./crypto-password-generator"

export const toolRegistry: Record<string, React.ComponentType> = {
  "uuid-generator": UuidGenerator,
  "token-generator": TokenGenerator,
  "base64-encoder-decoder": Base64Tool,
  "hash-generator": HashGenerator,
  "url-encoder-decoder": UrlEncoder,
  "html-entities": HtmlEntities,
  "password-generator": PasswordGenerator,
  "slug-generator": SlugGenerator,
  "case-converter": CaseConverter,
  "lorem-ipsum-generator": LoremIpsum,
  "timestamp-converter": TimestampConverter,
  "json-formatter": JsonFormatter,
  "color-converter": ColorConverter,
  "jwt-decoder": JwtDecoder,
  "cron-builder": CronBuilder,
  "crypto-token-generator": CryptoTokenGenerator,
  "crypto-hash-text": CryptoHashText,
  "crypto-bcrypt": CryptoBcrypt,
  "crypto-encrypt-decrypt": CryptoEncryptDecrypt,
  "crypto-hmac": CryptoHmac,
  "crypto-rsa-key-generator": CryptoRsaKeyGenerator,
  "crypto-password-generator": CryptoPasswordGenerator,
}
