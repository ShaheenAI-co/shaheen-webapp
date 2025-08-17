import React from "react";
import { useTranslations } from "next-intl";

export default function PrivacyPolicy() {
  const t = useTranslations("PrivacyPolicy");

  return (
    <div className="min-h-screen bg-[#06040D] text-white">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            {t("title")}
          </h1>
          <p className="text-gray-300 text-lg">
            {t("lastUpdated")}: {new Date().toLocaleDateString()}
          </p>
        </div>

        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-purple-300">
              {t("introduction.title")}
            </h2>
            <p className="text-gray-300 leading-relaxed">
              {t("introduction.content")}
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-purple-300">
              {t("informationCollection.title")}
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-medium mb-2 text-purple-200">
                  {t("informationCollection.personalInfo.title")}
                </h3>
                <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                  {t
                    .raw("informationCollection.personalInfo.items")
                    .map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-medium mb-2 text-purple-200">
                  {t("informationCollection.usageInfo.title")}
                </h3>
                <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                  {t
                    .raw("informationCollection.usageInfo.items")
                    .map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-purple-300">
              {t("howWeUse.title")}
            </h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              {t("howWeUse.intro")}
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
              {t.raw("howWeUse.items").map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-purple-300">
              {t("aiProcessing.title")}
            </h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              {t("aiProcessing.intro")}
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
              {t.raw("aiProcessing.items").map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
            <p className="text-gray-300 leading-relaxed mt-4">
              {t("aiProcessing.additional")}
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-purple-300">
              {t("informationSharing.title")}
            </h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              {t("informationSharing.intro")}
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
              {t.raw("informationSharing.items").map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-purple-300">
              {t("dataSecurity.title")}
            </h2>
            <p className="text-gray-300 leading-relaxed">
              {t("dataSecurity.content")}
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-purple-300">
              {t("yourRights.title")}
            </h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              {t("yourRights.intro")}
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
              {t.raw("yourRights.items").map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-purple-300">
              {t("cookies.title")}
            </h2>
            <p className="text-gray-300 leading-relaxed">
              {t("cookies.content")}
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-purple-300">
              {t("thirdParty.title")}
            </h2>
            <p className="text-gray-300 leading-relaxed">
              {t("thirdParty.content")}
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-purple-300">
              {t("childrenPrivacy.title")}
            </h2>
            <p className="text-gray-300 leading-relaxed">
              {t("childrenPrivacy.content")}
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-purple-300">
              {t("internationalTransfers.title")}
            </h2>
            <p className="text-gray-300 leading-relaxed">
              {t("internationalTransfers.content")}
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-purple-300">
              {t("changes.title")}
            </h2>
            <p className="text-gray-300 leading-relaxed">
              {t("changes.content")}
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-purple-300">
              {t("contact.title")}
            </h2>
            <p className="text-gray-300 leading-relaxed">
              {t("contact.intro")}
            </p>
            <div className="mt-4 p-4 bg-gray-800 rounded-lg">
              <p className="text-gray-300">
                <strong>{t("contact.email")}:</strong> privacy@shaheen.ai
                <br />
                <strong>{t("contact.address")}:</strong> [Your Business Address]
                <br />
                <strong>{t("contact.phone")}:</strong> [Your Contact Number]
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
