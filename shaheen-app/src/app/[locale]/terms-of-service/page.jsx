import React from "react";
import { useTranslations } from "next-intl";

export default function TermsOfService() {
  const t = useTranslations("TermsOfService");

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
          {/* Legal Definition */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-purple-300">
              {t("legalDefinition.title")}
            </h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              {t("legalDefinition.content")}
            </p>
            <div className="bg-gray-800 p-4 rounded-lg mb-4">
              <p className="text-gray-300 font-medium">
                {t("legalDefinition.company")}
              </p>
              <p className="text-gray-300">
                {t("legalDefinition.unifiedNumber")}
              </p>
              <p className="text-gray-300">{t("legalDefinition.address")}</p>
            </div>
            <p className="text-gray-300 leading-relaxed">
              {t("legalDefinition.agreement")}
            </p>
          </section>

          {/* Definitions */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-purple-300">
              {t("definitions.title")}
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-medium mb-2 text-purple-200">
                  {t("definitions.platform.title")}
                </h3>
                <p className="text-gray-300">
                  {t("definitions.platform.content")}
                </p>
              </div>
              <div>
                <h3 className="text-xl font-medium mb-2 text-purple-200">
                  {t("definitions.user.title")}
                </h3>
                <p className="text-gray-300">{t("definitions.user.content")}</p>
              </div>
              <div>
                <h3 className="text-xl font-medium mb-2 text-purple-200">
                  {t("definitions.content.title")}
                </h3>
                <p className="text-gray-300">
                  {t("definitions.content.content")}
                </p>
              </div>
              <div>
                <h3 className="text-xl font-medium mb-2 text-purple-200">
                  {t("definitions.data.title")}
                </h3>
                <p className="text-gray-300">{t("definitions.data.content")}</p>
              </div>
              <div>
                <h3 className="text-xl font-medium mb-2 text-purple-200">
                  {t("definitions.models.title")}
                </h3>
                <p className="text-gray-300">
                  {t("definitions.models.content")}
                </p>
              </div>
            </div>
          </section>

          {/* Account Creation */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-purple-300">
              {t("accountCreation.title")}
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-medium mb-2 text-purple-200">
                  {t("accountCreation.ageRequirement.title")}
                </h3>
                <p className="text-gray-300">
                  {t("accountCreation.ageRequirement.content")}
                </p>
              </div>
              <div>
                <h3 className="text-xl font-medium mb-2 text-purple-200">
                  {t("accountCreation.accurateInfo.title")}
                </h3>
                <p className="text-gray-300">
                  {t("accountCreation.accurateInfo.content")}
                </p>
              </div>
              <div>
                <h3 className="text-xl font-medium mb-2 text-purple-200">
                  {t("accountCreation.accountSuspension.title")}
                </h3>
                <p className="text-gray-300">
                  {t("accountCreation.accountSuspension.content")}
                </p>
              </div>
            </div>
          </section>

          {/* Service Scope */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-purple-300">
              {t("serviceScope.title")}
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-medium mb-2 text-purple-200">
                  {t("serviceScope.aiTools.title")}
                </h3>
                <p className="text-gray-300">
                  {t("serviceScope.aiTools.content")}
                </p>
              </div>
              <div>
                <h3 className="text-xl font-medium mb-2 text-purple-200">
                  {t("serviceScope.serviceChanges.title")}
                </h3>
                <p className="text-gray-300">
                  {t("serviceScope.serviceChanges.content")}
                </p>
              </div>
              <div>
                <h3 className="text-xl font-medium mb-2 text-purple-200">
                  {t("serviceScope.technicalLimitations.title")}
                </h3>
                <p className="text-gray-300">
                  {t("serviceScope.technicalLimitations.content")}
                </p>
              </div>
            </div>
          </section>

          {/* Customer Data Usage */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-purple-300">
              {t("customerDataUsage.title")}
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-medium mb-2 text-purple-200">
                  {t("customerDataUsage.dataConsent.title")}
                </h3>
                <p className="text-gray-300 mb-4">
                  {t("customerDataUsage.dataConsent.content")}
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                  {t
                    .raw("customerDataUsage.dataConsent.purposes")
                    .map((purpose, index) => (
                      <li key={index}>{purpose}</li>
                    ))}
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-medium mb-2 text-purple-200">
                  {t("customerDataUsage.dataMerging.title")}
                </h3>
                <p className="text-gray-300">
                  {t("customerDataUsage.dataMerging.content")}
                </p>
              </div>
              <div>
                <h3 className="text-xl font-medium mb-2 text-purple-200">
                  {t("customerDataUsage.dataSharing.title")}
                </h3>
                <p className="text-gray-300">
                  {t("customerDataUsage.dataSharing.content")}
                </p>
              </div>
            </div>
          </section>

          {/* Intellectual Property */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-purple-300">
              {t("intellectualProperty.title")}
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-medium mb-2 text-purple-200">
                  {t("intellectualProperty.platformRights.title")}
                </h3>
                <p className="text-gray-300">
                  {t("intellectualProperty.platformRights.content")}
                </p>
              </div>
              <div>
                <h3 className="text-xl font-medium mb-2 text-purple-200">
                  {t("intellectualProperty.userLicense.title")}
                </h3>
                <p className="text-gray-300">
                  {t("intellectualProperty.userLicense.content")}
                </p>
              </div>
              <div>
                <h3 className="text-xl font-medium mb-2 text-purple-200">
                  {t("intellectualProperty.restrictions.title")}
                </h3>
                <p className="text-gray-300">
                  {t("intellectualProperty.restrictions.content")}
                </p>
              </div>
            </div>
          </section>

          {/* Payment and Refund */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-purple-300">
              {t("paymentRefund.title")}
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-medium mb-2 text-purple-200">
                  {t("paymentRefund.trialPeriod.title")}
                </h3>
                <p className="text-gray-300">
                  {t("paymentRefund.trialPeriod.content")}
                </p>
              </div>
              <div>
                <h3 className="text-xl font-medium mb-2 text-purple-200">
                  {t("paymentRefund.noRefunds.title")}
                </h3>
                <p className="text-gray-300">
                  {t("paymentRefund.noRefunds.content")}
                </p>
              </div>
              <div>
                <h3 className="text-xl font-medium mb-2 text-purple-200">
                  {t("paymentRefund.finalPayments.title")}
                </h3>
                <p className="text-gray-300">
                  {t("paymentRefund.finalPayments.content")}
                </p>
              </div>
              <div>
                <h3 className="text-xl font-medium mb-2 text-purple-200">
                  {t("paymentRefund.priceChanges.title")}
                </h3>
                <p className="text-gray-300">
                  {t("paymentRefund.priceChanges.content")}
                </p>
              </div>
            </div>
          </section>

          {/* User Obligations */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-purple-300">
              {t("userObligations.title")}
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-medium mb-2 text-purple-200">
                  {t("userObligations.lawfulUse.title")}
                </h3>
                <p className="text-gray-300">
                  {t("userObligations.lawfulUse.content")}
                </p>
              </div>
              <div>
                <h3 className="text-xl font-medium mb-2 text-purple-200">
                  {t("userObligations.prohibitedContent.title")}
                </h3>
                <p className="text-gray-300">
                  {t("userObligations.prohibitedContent.content")}
                </p>
              </div>
              <div>
                <h3 className="text-xl font-medium mb-2 text-purple-200">
                  {t("userObligations.harmfulContent.title")}
                </h3>
                <p className="text-gray-300">
                  {t("userObligations.harmfulContent.content")}
                </p>
              </div>
              <div>
                <h3 className="text-xl font-medium mb-2 text-purple-200">
                  {t("userObligations.userResponsibility.title")}
                </h3>
                <p className="text-gray-300">
                  {t("userObligations.userResponsibility.content")}
                </p>
              </div>
            </div>
          </section>

          {/* Liability Limits */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-purple-300">
              {t("liabilityLimits.title")}
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-medium mb-2 text-purple-200">
                  {t("liabilityLimits.asIs.title")}
                </h3>
                <p className="text-gray-300">
                  {t("liabilityLimits.asIs.content")}
                </p>
              </div>
              <div>
                <h3 className="text-xl font-medium mb-2 text-purple-200">
                  {t("liabilityLimits.noLiability.title")}
                </h3>
                <p className="text-gray-300">
                  {t("liabilityLimits.noLiability.content")}
                </p>
              </div>
              <div>
                <h3 className="text-xl font-medium mb-2 text-purple-200">
                  {t("liabilityLimits.aiAccuracy.title")}
                </h3>
                <p className="text-gray-300">
                  {t("liabilityLimits.aiAccuracy.content")}
                </p>
              </div>
            </div>
          </section>

          {/* Policy Changes */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-purple-300">
              {t("policyChanges.title")}
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-medium mb-2 text-purple-200">
                  {t("policyChanges.rightToModify.title")}
                </h3>
                <p className="text-gray-300">
                  {t("policyChanges.rightToModify.content")}
                </p>
              </div>
              <div>
                <h3 className="text-xl font-medium mb-2 text-purple-200">
                  {t("policyChanges.notification.title")}
                </h3>
                <p className="text-gray-300">
                  {t("policyChanges.notification.content")}
                </p>
              </div>
              <div>
                <h3 className="text-xl font-medium mb-2 text-purple-200">
                  {t("policyChanges.continuedUse.title")}
                </h3>
                <p className="text-gray-300">
                  {t("policyChanges.continuedUse.content")}
                </p>
              </div>
            </div>
          </section>

          {/* Law and Jurisdiction */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-purple-300">
              {t("lawJurisdiction.title")}
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-medium mb-2 text-purple-200">
                  {t("lawJurisdiction.saudiLaw.title")}
                </h3>
                <p className="text-gray-300">
                  {t("lawJurisdiction.saudiLaw.content")}
                </p>
              </div>
              <div>
                <h3 className="text-xl font-medium mb-2 text-purple-200">
                  {t("lawJurisdiction.saudiCourts.title")}
                </h3>
                <p className="text-gray-300">
                  {t("lawJurisdiction.saudiCourts.content")}
                </p>
              </div>
            </div>
          </section>

          {/* General Provisions */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-purple-300">
              {t("generalProvisions.title")}
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-medium mb-2 text-purple-200">
                  {t("generalProvisions.severability.title")}
                </h3>
                <p className="text-gray-300">
                  {t("generalProvisions.severability.content")}
                </p>
              </div>
              <div>
                <h3 className="text-xl font-medium mb-2 text-purple-200">
                  {t("generalProvisions.entireAgreement.title")}
                </h3>
                <p className="text-gray-300">
                  {t("generalProvisions.entireAgreement.content")}
                </p>
              </div>
              <div>
                <h3 className="text-xl font-medium mb-2 text-purple-200">
                  {t("generalProvisions.noWaiver.title")}
                </h3>
                <p className="text-gray-300">
                  {t("generalProvisions.noWaiver.content")}
                </p>
              </div>
            </div>
          </section>

          {/* User Acknowledgement */}
          <section className="bg-purple-900/20 p-6 rounded-lg border border-purple-500/30">
            <h2 className="text-2xl font-semibold mb-4 text-purple-300">
              {t("userAcknowledgement.title")}
            </h2>
            <p className="text-gray-300 leading-relaxed">
              {t("userAcknowledgement.content")}
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
