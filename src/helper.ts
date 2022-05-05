import { ImageProps, IColumnProps, IUserProps } from './store'

export function generateFitUrl(data: ImageProps, width: number, height: number, format = ['m_pad']) {
    if (data && data.url) {
        // Array.prototye.reduce() 方法对数组中的每个元素按序执行一个由您提供的 reducer 函数，每一次运行 reducer 会将先前元素的计算结果作为参数传入，最后将其结果汇总为单个返回值。prev: 上一次调用 callbackFn 时的返回值 current: 数组中正在处理的元素
        const formatStr = format.reduce((prev, current) => {
            return current + ',' + prev
        }, '')
        data.fitUrl = data.url + `?x-oss-process=image/resize,${formatStr}h_${height},w_${width}`
    }
}

export function addColumnAvatar(data: IColumnProps | IUserProps, width: number, height: number) {
    if (data.avatar) {
      generateFitUrl(data.avatar, width, height)
    } else {
      const parseCol = data as IColumnProps
      data.avatar = {
        fitUrl: require(parseCol.title ? '@/assets/column.jpg' : '@/assets/defaultAvatar.png')
      }
    }
  }

interface CheckCondition {
    format?: string[];
    size?: number;
}
type ErrorType = 'format' | 'size' | null
export function beforeUploadCheck(file: File, condition: CheckCondition) {
    const { format, size } = condition
    // includes() 方法用来判断一个数组是否包含一个指定的值，根据情况，如果包含则返回 true，否则返回 false
    // 如果对文件类型有格式要求, 判断文件的的类型是否属于格式要求。没有格式要求的话, 直接返回true。
    const isValidFormat = format ? format.includes(file.type) : true    
    const isValidSize = size ? (file.size / 1024 / 1024 < size) : true
    let error: ErrorType = null
    if (!isValidFormat) { // isValidFormat为false, 即文件的类型不合法
        error = 'format'
    }
    if (!isValidSize) {
        error = 'size'
    }
    return {
        passed: isValidFormat && isValidSize,
        error
    }
}

interface TestProps {
    _id: string;
    name: string;
}
const testData: TestProps[] = [{ _id: '1', name: 'a' }, { _id: '2', name: 'b' }]
const testData2: {[key: string]: TestProps} = {
    1: { _id: '1', name: 'a' },
    2: { _id: '2', name: 'b' },
}
export const arrToObj = <T extends { _id?: string }>(arr: Array<T>) => {
    return arr.reduce((prev, current) => {
        if (current._id) {
            prev[current._id] = current
        }
        return prev
    }, {} as { [key: string]: T })
}
const result = arrToObj(testData)

export const objToArr = <T>(obj: {[key: string]: T}) => {
    return Object.keys(obj).map(key => obj[key])
}
const result2 = objToArr(testData2)
  