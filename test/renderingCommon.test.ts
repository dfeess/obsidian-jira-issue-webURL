jest.mock('../src/main', () => {
    return { ObsidianApp: { vault: { getConfig: jest.fn() } } }
})
jest.mock('../src/settings', () => { return { SettingsData: { colorSchema: null } } })

import { SettingsData } from '../src/settings'
import RC from '../src/rendering/renderingCommon'
import { EColorSchema } from '../src/interfaces/settingsInterfaces'
import * as main from '../src/main'
import { TestAccountOpen } from './testData'

const kLightCSSClass = 'is-light'
const kDarkCSSClass = 'is-dark'

// @ts-ignore
const getConfigMock: jest.Mock = main.ObsidianApp.vault.getConfig

describe('RenderingCommon', () => {
    describe('getTheme', () => {
        test('Light', () => {
            SettingsData.colorSchema = EColorSchema.LIGHT
            expect(RC.getTheme()).toEqual(kLightCSSClass)
        })
        test('Dark', () => {
            SettingsData.colorSchema = EColorSchema.DARK
            expect(RC.getTheme()).toEqual(kDarkCSSClass)
        })
        test('Not Set', () => {
            SettingsData.colorSchema = null
            expect(RC.getTheme()).toEqual(kLightCSSClass)
        })
        test('Follow Obsidian - Light', () => {
            getConfigMock.mockReturnValueOnce('moonstone')
            SettingsData.colorSchema = EColorSchema.FOLLOW_OBSIDIAN
            expect(RC.getTheme()).toEqual(kLightCSSClass)
        })
        test('Follow Obsidian - Dark', () => {
            getConfigMock.mockReturnValueOnce('obsidian')
            SettingsData.colorSchema = EColorSchema.FOLLOW_OBSIDIAN
            expect(RC.getTheme()).toEqual(kDarkCSSClass)
        })
    })

    describe('web links', () => {
        test('uses webBaseUrl and strips trailing slashes', () => {
            const account = { ...TestAccountOpen, webBaseUrl: 'https://jira.mycompany.com///' }

            expect(RC.issueUrl(account, 'AAA-123')).toBe('https://jira.mycompany.com/browse/AAA-123')
            expect(RC.searchUrl(account, 'project = TEST')).toBe('https://jira.mycompany.com/issues/?jql=project%20=%20TEST')
        })

        test('falls back to host when webBaseUrl is empty', () => {
            const account = { ...TestAccountOpen, webBaseUrl: '', host: 'https://jira.mycompany.com///' }

            expect(RC.issueUrl(account, 'AAA-123')).toBe('https://jira.mycompany.com/browse/AAA-123')
        })
    })

    afterEach(() => {
        jest.clearAllMocks()
    })
})

export { }
