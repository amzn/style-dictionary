/* @web/test-runner snapshot v1 */
export const snapshots = {};

snapshots["formats ios-swift/any.swift should match default snapshot"] =
`
//
// __output/
//

// Do not edit directly
// Generated on Sat, 01 Jan 2000 00:00:00 GMT


import UIKit

public class StyleDictionary {
    public static let colorBaseRed = UIColor(red: 1.000, green: 0.000, blue: 0.000, alpha: 1)
}`;
/* end snapshot formats ios-swift/any.swift should match default snapshot */

snapshots["formats ios-swift/any.swift with import override should match snapshot"] =
`
//
// __output/
//

// Do not edit directly
// Generated on Sat, 01 Jan 2000 00:00:00 GMT


import UIKit
import AnotherModule

public class StyleDictionary {
    public static let colorBaseRed = UIColor(red: 1.000, green: 0.000, blue: 0.000, alpha: 1)
}`;
/* end snapshot formats ios-swift/any.swift with import override should match snapshot */

snapshots["formats ios-swift/any.swift with objectType override should match snapshot"] =
`
//
// __output/
//

// Do not edit directly
// Generated on Sat, 01 Jan 2000 00:00:00 GMT


import UIKit

public struct StyleDictionary {
    public static let colorBaseRed = UIColor(red: 1.000, green: 0.000, blue: 0.000, alpha: 1)
}`;
/* end snapshot formats ios-swift/any.swift with objectType override should match snapshot */

snapshots["formats ios-swift/any.swift with access control override should match snapshot"] =
`
//
// __output/
//

// Do not edit directly
// Generated on Sat, 01 Jan 2000 00:00:00 GMT


import UIKit

internal class StyleDictionary {
    internal static let colorBaseRed = UIColor(red: 1.000, green: 0.000, blue: 0.000, alpha: 1)
}`;
/* end snapshot formats ios-swift/any.swift with access control override should match snapshot */

