/**
 * Side-effect imports: register Satchel mutators before orchestrators so each
 * action runs mutators first, then orchestrators.
 */
import "@/mutators/settingsMutators"
import "@/mutators/tokenStreamsMutators"
import "@/mutators/chartMutators"
import "@/mutators/marketMutators"
import "@/orchestrators/settingsOrchestrators"
import "@/orchestrators/tokenStreamsOrchestrators"
import "@/orchestrators/chartOrchestrators"
import "@/orchestrators/marketOrchestrators"
