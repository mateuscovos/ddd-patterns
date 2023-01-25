export default interface EventInterface<T = any> {
    dataTimeOccurred: Date
    eventData: T
}