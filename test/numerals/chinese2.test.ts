import { describe, expect, test } from 'bun:test'
import {
  chineseFinancialToWords,
  chineseWordsToFinancial,
  fromChineseEarthlyBranch,
  fromChineseHeavenlyStem,
  fromChineseSolarTerm,
  toChineseEarthlyBranch,
  toChineseHeavenlyStem,
  toChineseSolarTerm,
} from '../../src'

describe('Chinese Financial Numerals', () => {
  describe('chineseWordsToFinancial', () => {
    test('converts individual numbers correctly', () => {
      expect(chineseWordsToFinancial('零')).toBe('零')
      expect(chineseWordsToFinancial('一')).toBe('壹')
      expect(chineseWordsToFinancial('二')).toBe('贰')
      expect(chineseWordsToFinancial('三')).toBe('叁')
      expect(chineseWordsToFinancial('四')).toBe('肆')
      expect(chineseWordsToFinancial('五')).toBe('伍')
      expect(chineseWordsToFinancial('六')).toBe('陆')
      expect(chineseWordsToFinancial('七')).toBe('柒')
      expect(chineseWordsToFinancial('八')).toBe('捌')
      expect(chineseWordsToFinancial('九')).toBe('玖')
    })

    test('converts place values correctly', () => {
      expect(chineseWordsToFinancial('十')).toBe('拾')
      expect(chineseWordsToFinancial('百')).toBe('佰')
      expect(chineseWordsToFinancial('千')).toBe('仟')
      expect(chineseWordsToFinancial('万')).toBe('万')
      expect(chineseWordsToFinancial('亿')).toBe('亿')
    })

    test('converts complex numbers correctly', () => {
      expect(chineseWordsToFinancial('一百二十三')).toBe('壹佰贰拾叁')
      expect(chineseWordsToFinancial('一千零一')).toBe('壹仟零壹')
      expect(chineseWordsToFinancial('一万零一百零一')).toBe('壹万零壹佰零壹')
      expect(chineseWordsToFinancial('一亿两千三百万零五百')).toBe(
        '壹亿贰仟叁佰万零伍佰'
      )
    })

    test('keeps non-numerical characters unchanged', () => {
      expect(chineseWordsToFinancial('价值一百元')).toBe('价值壹佰元')
      expect(chineseWordsToFinancial('人民币贰佰元整')).toBe('人民币贰佰元整')
    })
  })

  describe('chineseFinancialToWords', () => {
    test('converts individual financial numbers correctly', () => {
      expect(chineseFinancialToWords('零')).toBe('零')
      expect(chineseFinancialToWords('壹')).toBe('一')
      expect(chineseFinancialToWords('贰')).toBe('二')
      expect(chineseFinancialToWords('叁')).toBe('三')
      expect(chineseFinancialToWords('肆')).toBe('四')
      expect(chineseFinancialToWords('伍')).toBe('五')
      expect(chineseFinancialToWords('陆')).toBe('六')
      expect(chineseFinancialToWords('柒')).toBe('七')
      expect(chineseFinancialToWords('捌')).toBe('八')
      expect(chineseFinancialToWords('玖')).toBe('九')
    })

    test('converts financial place values correctly', () => {
      expect(chineseFinancialToWords('拾')).toBe('十')
      expect(chineseFinancialToWords('佰')).toBe('百')
      expect(chineseFinancialToWords('仟')).toBe('千')
      expect(chineseFinancialToWords('万')).toBe('万')
      expect(chineseFinancialToWords('亿')).toBe('亿')
    })

    test('converts complex financial numbers correctly', () => {
      expect(chineseFinancialToWords('壹佰贰拾叁')).toBe('一百二十三')
      expect(chineseFinancialToWords('壹仟零壹')).toBe('一千零一')
      expect(chineseFinancialToWords('壹万零壹佰零壹')).toBe('一万零一百零一')
      expect(chineseFinancialToWords('壹亿贰仟叁佰万零伍佰')).toBe(
        '一亿二千三百万零五百'
      )
    })

    test('keeps non-financial characters unchanged', () => {
      expect(chineseFinancialToWords('价值壹佰元')).toBe('价值一百元')
      expect(chineseFinancialToWords('人民币贰佰元整')).toBe('人民币二百元整')
    })
  })

  test('financial character conversion is bidirectional', () => {
    const testCases = [
      '一百二十三',
      '五千六百七十八',
      '一亿二千三百四十五万六千七百八十九',
    ]
    testCases.forEach((testCase) => {
      expect(chineseFinancialToWords(chineseWordsToFinancial(testCase))).toBe(
        testCase
      )
    })
  })
})

describe('Chinese Heavenly Stems', () => {
  describe('toChineseHeavenlyStem', () => {
    test('converts valid numbers to heavenly stems', () => {
      expect(toChineseHeavenlyStem(1)).toBe('甲')
      expect(toChineseHeavenlyStem(2)).toBe('乙')
      expect(toChineseHeavenlyStem(3)).toBe('丙')
      expect(toChineseHeavenlyStem(4)).toBe('丁')
      expect(toChineseHeavenlyStem(5)).toBe('戊')
      expect(toChineseHeavenlyStem(6)).toBe('己')
      expect(toChineseHeavenlyStem(7)).toBe('庚')
      expect(toChineseHeavenlyStem(8)).toBe('辛')
      expect(toChineseHeavenlyStem(9)).toBe('壬')
      expect(toChineseHeavenlyStem(10)).toBe('癸')
    })

    test('throws error for invalid numbers', () => {
      expect(() => toChineseHeavenlyStem(0)).toThrow()
      expect(() => toChineseHeavenlyStem(11)).toThrow()
      expect(() => toChineseHeavenlyStem(-1)).toThrow()
    })

    test('handles circular indexing', () => {
      expect(toChineseHeavenlyStem(1, true)).toBe('甲')
      expect(toChineseHeavenlyStem(11, true)).toBe('甲')
      expect(toChineseHeavenlyStem(12, true)).toBe('乙')
      expect(toChineseHeavenlyStem(20, true)).toBe('癸')
      expect(toChineseHeavenlyStem(21, true)).toBe('甲')
    })
  })

  describe('fromChineseHeavenlyStem', () => {
    test('converts heavenly stems to numbers', () => {
      expect(fromChineseHeavenlyStem('甲')).toBe(1)
      expect(fromChineseHeavenlyStem('乙')).toBe(2)
      expect(fromChineseHeavenlyStem('丙')).toBe(3)
      expect(fromChineseHeavenlyStem('丁')).toBe(4)
      expect(fromChineseHeavenlyStem('戊')).toBe(5)
      expect(fromChineseHeavenlyStem('己')).toBe(6)
      expect(fromChineseHeavenlyStem('庚')).toBe(7)
      expect(fromChineseHeavenlyStem('辛')).toBe(8)
      expect(fromChineseHeavenlyStem('壬')).toBe(9)
      expect(fromChineseHeavenlyStem('癸')).toBe(10)
    })

    test('throws error for invalid stems', () => {
      expect(() => fromChineseHeavenlyStem('子')).toThrow()
      expect(() => fromChineseHeavenlyStem('A')).toThrow()
      expect(() => fromChineseHeavenlyStem('')).toThrow()
    })
  })

  test('heavenly stem conversion is bidirectional', () => {
    for (let i = 1; i <= 10; i++) {
      const stem = toChineseHeavenlyStem(i)
      expect(fromChineseHeavenlyStem(stem)).toBe(i)
    }
  })
})

describe('Chinese Earthly Branches', () => {
  describe('toChineseEarthlyBranch', () => {
    test('converts valid numbers to earthly branches', () => {
      expect(toChineseEarthlyBranch(1)).toBe('子')
      expect(toChineseEarthlyBranch(2)).toBe('丑')
      expect(toChineseEarthlyBranch(3)).toBe('寅')
      expect(toChineseEarthlyBranch(4)).toBe('卯')
      expect(toChineseEarthlyBranch(5)).toBe('辰')
      expect(toChineseEarthlyBranch(6)).toBe('巳')
      expect(toChineseEarthlyBranch(7)).toBe('午')
      expect(toChineseEarthlyBranch(8)).toBe('未')
      expect(toChineseEarthlyBranch(9)).toBe('申')
      expect(toChineseEarthlyBranch(10)).toBe('酉')
      expect(toChineseEarthlyBranch(11)).toBe('戌')
      expect(toChineseEarthlyBranch(12)).toBe('亥')
    })

    test('throws error for invalid numbers', () => {
      expect(() => toChineseEarthlyBranch(0)).toThrow()
      expect(() => toChineseEarthlyBranch(13)).toThrow()
      expect(() => toChineseEarthlyBranch(-1)).toThrow()
    })

    test('handles circular indexing', () => {
      expect(toChineseEarthlyBranch(1, true)).toBe('子')
      expect(toChineseEarthlyBranch(13, true)).toBe('子')
      expect(toChineseEarthlyBranch(14, true)).toBe('丑')
      expect(toChineseEarthlyBranch(24, true)).toBe('亥')
      expect(toChineseEarthlyBranch(25, true)).toBe('子')
    })
  })

  describe('fromChineseEarthlyBranch', () => {
    test('converts earthly branches to numbers', () => {
      expect(fromChineseEarthlyBranch('子')).toBe(1)
      expect(fromChineseEarthlyBranch('丑')).toBe(2)
      expect(fromChineseEarthlyBranch('寅')).toBe(3)
      expect(fromChineseEarthlyBranch('卯')).toBe(4)
      expect(fromChineseEarthlyBranch('辰')).toBe(5)
      expect(fromChineseEarthlyBranch('巳')).toBe(6)
      expect(fromChineseEarthlyBranch('午')).toBe(7)
      expect(fromChineseEarthlyBranch('未')).toBe(8)
      expect(fromChineseEarthlyBranch('申')).toBe(9)
      expect(fromChineseEarthlyBranch('酉')).toBe(10)
      expect(fromChineseEarthlyBranch('戌')).toBe(11)
      expect(fromChineseEarthlyBranch('亥')).toBe(12)
    })

    test('throws error for invalid branches', () => {
      expect(() => fromChineseEarthlyBranch('甲')).toThrow()
      expect(() => fromChineseEarthlyBranch('A')).toThrow()
      expect(() => fromChineseEarthlyBranch('')).toThrow()
    })
  })

  test('earthly branch conversion is bidirectional', () => {
    for (let i = 1; i <= 12; i++) {
      const branch = toChineseEarthlyBranch(i)
      expect(fromChineseEarthlyBranch(branch)).toBe(i)
    }
  })
})

describe('Chinese Solar Terms', () => {
  describe('toChineseSolarTerm', () => {
    test('converts valid numbers to solar terms', () => {
      expect(toChineseSolarTerm(1)).toBe('立春')
      expect(toChineseSolarTerm(2)).toBe('雨水')
      expect(toChineseSolarTerm(3)).toBe('惊蛰')
      expect(toChineseSolarTerm(6)).toBe('谷雨')
      expect(toChineseSolarTerm(7)).toBe('立夏')
      expect(toChineseSolarTerm(12)).toBe('大暑')
      expect(toChineseSolarTerm(13)).toBe('立秋')
      expect(toChineseSolarTerm(18)).toBe('霜降')
      expect(toChineseSolarTerm(19)).toBe('立冬')
      expect(toChineseSolarTerm(24)).toBe('大寒')
    })

    test('throws error for invalid numbers', () => {
      expect(() => toChineseSolarTerm(0)).toThrow()
      expect(() => toChineseSolarTerm(25)).toThrow()
      expect(() => toChineseSolarTerm(-1)).toThrow()
    })

    test('handles circular indexing', () => {
      expect(toChineseSolarTerm(1, true)).toBe('立春')
      expect(toChineseSolarTerm(25, true)).toBe('立春')
      expect(toChineseSolarTerm(26, true)).toBe('雨水')
      expect(toChineseSolarTerm(48, true)).toBe('大寒')
      expect(toChineseSolarTerm(49, true)).toBe('立春')
    })
  })

  describe('fromChineseSolarTerm', () => {
    test('converts solar terms to numbers', () => {
      expect(fromChineseSolarTerm('立春')).toBe(1)
      expect(fromChineseSolarTerm('雨水')).toBe(2)
      expect(fromChineseSolarTerm('惊蛰')).toBe(3)
      expect(fromChineseSolarTerm('春分')).toBe(4)
      expect(fromChineseSolarTerm('清明')).toBe(5)
      expect(fromChineseSolarTerm('谷雨')).toBe(6)
      expect(fromChineseSolarTerm('立夏')).toBe(7)
      expect(fromChineseSolarTerm('小满')).toBe(8)
      expect(fromChineseSolarTerm('芒种')).toBe(9)
      expect(fromChineseSolarTerm('夏至')).toBe(10)
      expect(fromChineseSolarTerm('小暑')).toBe(11)
      expect(fromChineseSolarTerm('大暑')).toBe(12)
      expect(fromChineseSolarTerm('立秋')).toBe(13)
      expect(fromChineseSolarTerm('处暑')).toBe(14)
      expect(fromChineseSolarTerm('白露')).toBe(15)
      expect(fromChineseSolarTerm('秋分')).toBe(16)
      expect(fromChineseSolarTerm('寒露')).toBe(17)
      expect(fromChineseSolarTerm('霜降')).toBe(18)
      expect(fromChineseSolarTerm('立冬')).toBe(19)
      expect(fromChineseSolarTerm('小雪')).toBe(20)
      expect(fromChineseSolarTerm('大雪')).toBe(21)
      expect(fromChineseSolarTerm('冬至')).toBe(22)
      expect(fromChineseSolarTerm('小寒')).toBe(23)
      expect(fromChineseSolarTerm('大寒')).toBe(24)
    })

    test('throws error for invalid solar terms', () => {
      expect(() => fromChineseSolarTerm('立')).toThrow()
      expect(() => fromChineseSolarTerm('春分节')).toThrow()
      expect(() => fromChineseSolarTerm('')).toThrow()
    })
  })

  test('solar term conversion is bidirectional', () => {
    for (let i = 1; i <= 24; i++) {
      const solarTerm = toChineseSolarTerm(i)
      expect(fromChineseSolarTerm(solarTerm)).toBe(i)
    }
  })
})

describe('Integration tests', () => {
  test('can convert between different Chinese numbering systems', () => {
    // Test converting a financial numeral to a Chinese numeral and then to heavenly stem
    const financial = '壹'
    const word = chineseFinancialToWords(financial) // '一'
    const heavenlyStem = toChineseHeavenlyStem(1) // '甲'

    expect(word).toBe('一')
    expect(heavenlyStem).toBe('甲')

    // Test the reverse
    const stemNumber = fromChineseHeavenlyStem(heavenlyStem) // 1
    const financialBack = chineseWordsToFinancial(word) // '壹'

    expect(stemNumber).toBe(1)
    expect(financialBack).toBe('壹')
  })

  test('can work with complex combinations', () => {
    // Create a complex case: "甲子年三月十五日"
    const stem = toChineseHeavenlyStem(1) // '甲'
    const branch = toChineseEarthlyBranch(1) // '子'
    const month = chineseWordsToFinancial('三') // '叁'
    const day = chineseWordsToFinancial('十五') // '拾伍'

    const date = `${stem}${branch}年${month}月${day}日`
    expect(date).toBe('甲子年叁月拾伍日')

    // Now parse it back
    const parts = date.match(/^(.)(.)年(.)月(.+)日$/)

    expect(parts).not.toBeNull()

    if (parts) {
      const extractedStem = parts[1]
      const extractedBranch = parts[2]
      const extractedMonth = parts[3]
      const extractedDay = parts[4]

      expect(fromChineseHeavenlyStem(extractedStem)).toBe(1)
      expect(fromChineseEarthlyBranch(extractedBranch)).toBe(1)
      expect(chineseFinancialToWords(extractedMonth)).toBe('三')
      expect(chineseFinancialToWords(extractedDay)).toBe('十五')
    }
  })

  test('edge cases and error handling', () => {
    // Test with empty strings
    expect(chineseWordsToFinancial('')).toBe('')
    expect(chineseFinancialToWords('')).toBe('')

    // Test with mixed content
    const mixed = '我有壹佰元和$100'
    expect(chineseFinancialToWords(mixed)).toBe('我有一百元和$100')

    // Test with circular indexing
    expect(toChineseHeavenlyStem(21, true)).toBe('甲')
    expect(toChineseEarthlyBranch(25, true)).toBe('子')
    expect(toChineseSolarTerm(49, true)).toBe('立春')
  })
})

// Test for comprehensive coverage
describe('Comprehensive coverage', () => {
  test('financial numerals dictionary covers all cases', () => {
    const allNumerals = '零一二三四五六七八九十百千万亿'
    const allFinancials = '零壹贰叁肆伍陆柒捌玖拾佰仟万亿'

    for (let i = 0; i < allNumerals.length; i++) {
      expect(chineseWordsToFinancial(allNumerals[i])).toBe(allFinancials[i])
    }

    for (let i = 0; i < allFinancials.length; i++) {
      expect(chineseFinancialToWords(allFinancials[i])).toBe(allNumerals[i])
    }
  })

  test('all stems, branches and solar terms are reversible', () => {
    const stems = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸']
    const branches = [
      '子',
      '丑',
      '寅',
      '卯',
      '辰',
      '巳',
      '午',
      '未',
      '申',
      '酉',
      '戌',
      '亥',
    ]
    const solarTerms = [
      '立春',
      '雨水',
      '惊蛰',
      '春分',
      '清明',
      '谷雨',
      '立夏',
      '小满',
      '芒种',
      '夏至',
      '小暑',
      '大暑',
      '立秋',
      '处暑',
      '白露',
      '秋分',
      '寒露',
      '霜降',
      '立冬',
      '小雪',
      '大雪',
      '冬至',
      '小寒',
      '大寒',
    ]

    // Test all heavenly stems
    stems.forEach((stem, index) => {
      expect(toChineseHeavenlyStem(index + 1)).toBe(stem)
      expect(fromChineseHeavenlyStem(stem)).toBe(index + 1)
    })

    // Test all earthly branches
    branches.forEach((branch, index) => {
      expect(toChineseEarthlyBranch(index + 1)).toBe(branch)
      expect(fromChineseEarthlyBranch(branch)).toBe(index + 1)
    })

    // Test all solar terms
    solarTerms.forEach((term, index) => {
      expect(toChineseSolarTerm(index + 1)).toBe(term)
      expect(fromChineseSolarTerm(term)).toBe(index + 1)
    })
  })
})
