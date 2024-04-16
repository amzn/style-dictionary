/* @web/test-runner snapshot v1 */
export const snapshots = {};

snapshots["integration dotnet color dotnet/class.cs should match snapshot"] = 
`
//
// Color.g.cs
//

// Do not edit directly
// Generated on Sat, 01 Jan 2000 00:00:00 GMT



namespace TODO;

using System.CodeDom.Compiler;
using Microsoft.Maui.Graphics;

[GeneratedCode("TODO", "TODO")]
public static class Colors {
    public static Color ColorBackgroundDanger = new Color(red: 1.000f, green: 0.918f, blue: 0.914f, alpha: 1.000f);
    public static Color ColorBackgroundDisabled = new Color(red: 0.871f, green: 0.882f, blue: 0.882f, alpha: 1.000f);
    public static Color ColorBackgroundInfo = new Color(red: 0.914f, green: 0.973f, blue: 1.000f, alpha: 1.000f);
    public static Color ColorBackgroundPrimary = new Color(red: 1.000f, green: 1.000f, blue: 1.000f, alpha: 1.000f);
    public static Color ColorBackgroundSecondary = new Color(red: 0.953f, green: 0.957f, blue: 0.957f, alpha: 1.000f);
    public static Color ColorBackgroundSuccess = new Color(red: 0.922f, green: 0.976f, blue: 0.922f, alpha: 1.000f);
    public static Color ColorBackgroundTertiary = new Color(red: 0.871f, green: 0.882f, blue: 0.882f, alpha: 1.000f);
    public static Color ColorBackgroundWarning = new Color(red: 1.000f, green: 0.929f, blue: 0.890f, alpha: 1.000f);
    public static Color ColorBorderPrimary = new Color(red: 0.784f, green: 0.800f, blue: 0.800f, alpha: 1.000f);
    public static Color ColorBrandPrimary = new Color(red: 0.043f, green: 0.522f, blue: 0.600f, alpha: 1.000f);
    public static Color ColorBrandSecondary = new Color(red: 0.435f, green: 0.369f, blue: 0.827f, alpha: 1.000f);
    public static Color ColorCoreAqua0 = new Color(red: 0.851f, green: 0.988f, blue: 0.984f, alpha: 1.000f);
    public static Color ColorCoreAqua100 = new Color(red: 0.773f, green: 0.976f, blue: 0.976f, alpha: 1.000f);
    public static Color ColorCoreAqua1000 = new Color(red: 0.031f, green: 0.239f, blue: 0.310f, alpha: 1.000f);
    public static Color ColorCoreAqua1100 = new Color(red: 0.000f, green: 0.157f, blue: 0.220f, alpha: 1.000f);
    public static Color ColorCoreAqua200 = new Color(red: 0.647f, green: 0.949f, blue: 0.949f, alpha: 1.000f);
    public static Color ColorCoreAqua300 = new Color(red: 0.463f, green: 0.898f, blue: 0.886f, alpha: 1.000f);
    public static Color ColorCoreAqua400 = new Color(red: 0.200f, green: 0.839f, blue: 0.886f, alpha: 1.000f);
    public static Color ColorCoreAqua500 = new Color(red: 0.090f, green: 0.722f, blue: 0.808f, alpha: 1.000f);
    public static Color ColorCoreAqua600 = new Color(red: 0.027f, green: 0.592f, blue: 0.682f, alpha: 1.000f);
    public static Color ColorCoreAqua700 = new Color(red: 0.043f, green: 0.522f, blue: 0.600f, alpha: 1.000f);
    public static Color ColorCoreAqua800 = new Color(red: 0.059f, green: 0.431f, blue: 0.518f, alpha: 1.000f);
    public static Color ColorCoreAqua900 = new Color(red: 0.012f, green: 0.369f, blue: 0.451f, alpha: 1.000f);
    public static Color ColorCoreBlue0 = new Color(red: 0.914f, green: 0.973f, blue: 1.000f, alpha: 1.000f);
    public static Color ColorCoreBlue100 = new Color(red: 0.863f, green: 0.949f, blue: 1.000f, alpha: 1.000f);
    public static Color ColorCoreBlue1000 = new Color(red: 0.039f, green: 0.224f, blue: 0.376f, alpha: 1.000f);
    public static Color ColorCoreBlue1100 = new Color(red: 0.000f, green: 0.129f, blue: 0.220f, alpha: 1.000f);
    public static Color ColorCoreBlue200 = new Color(red: 0.780f, green: 0.894f, blue: 0.976f, alpha: 1.000f);
    public static Color ColorCoreBlue300 = new Color(red: 0.631f, green: 0.824f, blue: 0.973f, alpha: 1.000f);
    public static Color ColorCoreBlue400 = new Color(red: 0.337f, green: 0.678f, blue: 0.961f, alpha: 1.000f);
    public static Color ColorCoreBlue500 = new Color(red: 0.220f, green: 0.588f, blue: 0.890f, alpha: 1.000f);
    public static Color ColorCoreBlue600 = new Color(red: 0.169f, green: 0.529f, blue: 0.827f, alpha: 1.000f);
    public static Color ColorCoreBlue700 = new Color(red: 0.125f, green: 0.475f, blue: 0.765f, alpha: 1.000f);
    public static Color ColorCoreBlue800 = new Color(red: 0.067f, green: 0.427f, blue: 0.667f, alpha: 1.000f);
    public static Color ColorCoreBlue900 = new Color(red: 0.047f, green: 0.337f, blue: 0.537f, alpha: 1.000f);
    public static Color ColorCoreGreen0 = new Color(red: 0.922f, green: 0.976f, blue: 0.922f, alpha: 1.000f);
    public static Color ColorCoreGreen100 = new Color(red: 0.843f, green: 0.957f, blue: 0.843f, alpha: 1.000f);
    public static Color ColorCoreGreen1000 = new Color(red: 0.031f, green: 0.259f, blue: 0.184f, alpha: 1.000f);
    public static Color ColorCoreGreen1100 = new Color(red: 0.000f, green: 0.169f, blue: 0.125f, alpha: 1.000f);
    public static Color ColorCoreGreen200 = new Color(red: 0.761f, green: 0.949f, blue: 0.741f, alpha: 1.000f);
    public static Color ColorCoreGreen300 = new Color(red: 0.596f, green: 0.898f, blue: 0.557f, alpha: 1.000f);
    public static Color ColorCoreGreen400 = new Color(red: 0.459f, green: 0.867f, blue: 0.400f, alpha: 1.000f);
    public static Color ColorCoreGreen500 = new Color(red: 0.349f, green: 0.796f, blue: 0.349f, alpha: 1.000f);
    public static Color ColorCoreGreen600 = new Color(red: 0.169f, green: 0.714f, blue: 0.337f, alpha: 1.000f);
    public static Color ColorCoreGreen700 = new Color(red: 0.047f, green: 0.655f, blue: 0.314f, alpha: 1.000f);
    public static Color ColorCoreGreen800 = new Color(red: 0.000f, green: 0.545f, blue: 0.275f, alpha: 1.000f);
    public static Color ColorCoreGreen900 = new Color(red: 0.000f, green: 0.420f, blue: 0.251f, alpha: 1.000f);
    public static Color ColorCoreMagenta0 = new Color(red: 0.996f, green: 0.941f, blue: 1.000f, alpha: 1.000f);
    public static Color ColorCoreMagenta100 = new Color(red: 0.976f, green: 0.890f, blue: 0.988f, alpha: 1.000f);
    public static Color ColorCoreMagenta1000 = new Color(red: 0.271f, green: 0.082f, blue: 0.318f, alpha: 1.000f);
    public static Color ColorCoreMagenta1100 = new Color(red: 0.161f, green: 0.098f, blue: 0.176f, alpha: 1.000f);
    public static Color ColorCoreMagenta200 = new Color(red: 0.957f, green: 0.769f, blue: 0.969f, alpha: 1.000f);
    public static Color ColorCoreMagenta300 = new Color(red: 0.929f, green: 0.678f, blue: 0.949f, alpha: 1.000f);
    public static Color ColorCoreMagenta400 = new Color(red: 0.949f, green: 0.510f, blue: 0.961f, alpha: 1.000f);
    public static Color ColorCoreMagenta500 = new Color(red: 0.859f, green: 0.380f, blue: 0.859f, alpha: 1.000f);
    public static Color ColorCoreMagenta600 = new Color(red: 0.769f, green: 0.306f, blue: 0.725f, alpha: 1.000f);
    public static Color ColorCoreMagenta700 = new Color(red: 0.675f, green: 0.267f, blue: 0.659f, alpha: 1.000f);
    public static Color ColorCoreMagenta800 = new Color(red: 0.561f, green: 0.220f, blue: 0.588f, alpha: 1.000f);
    public static Color ColorCoreMagenta900 = new Color(red: 0.424f, green: 0.133f, blue: 0.467f, alpha: 1.000f);
    public static Color ColorCoreNeutral0 = new Color(red: 1.000f, green: 1.000f, blue: 1.000f, alpha: 1.000f);
    public static Color ColorCoreNeutral100 = new Color(red: 0.953f, green: 0.957f, blue: 0.957f, alpha: 1.000f);
    public static Color ColorCoreNeutral1000 = new Color(red: 0.086f, green: 0.125f, blue: 0.125f, alpha: 1.000f);
    public static Color ColorCoreNeutral1100 = new Color(red: 0.016f, green: 0.016f, blue: 0.016f, alpha: 1.000f);
    public static Color ColorCoreNeutral200 = new Color(red: 0.871f, green: 0.882f, blue: 0.882f, alpha: 1.000f);
    public static Color ColorCoreNeutral300 = new Color(red: 0.784f, green: 0.800f, blue: 0.800f, alpha: 1.000f);
    public static Color ColorCoreNeutral400 = new Color(red: 0.690f, green: 0.714f, blue: 0.718f, alpha: 1.000f);
    public static Color ColorCoreNeutral500 = new Color(red: 0.573f, green: 0.604f, blue: 0.608f, alpha: 1.000f);
    public static Color ColorCoreNeutral600 = new Color(red: 0.431f, green: 0.475f, blue: 0.478f, alpha: 1.000f);
    public static Color ColorCoreNeutral700 = new Color(red: 0.318f, green: 0.369f, blue: 0.373f, alpha: 1.000f);
    public static Color ColorCoreNeutral800 = new Color(red: 0.212f, green: 0.255f, blue: 0.255f, alpha: 1.000f);
    public static Color ColorCoreNeutral900 = new Color(red: 0.153f, green: 0.200f, blue: 0.200f, alpha: 1.000f);
    public static Color ColorCoreOrange0 = new Color(red: 1.000f, green: 0.929f, blue: 0.890f, alpha: 1.000f);
    public static Color ColorCoreOrange100 = new Color(red: 0.988f, green: 0.863f, blue: 0.800f, alpha: 1.000f);
    public static Color ColorCoreOrange1000 = new Color(red: 0.376f, green: 0.090f, blue: 0.000f, alpha: 1.000f);
    public static Color ColorCoreOrange1100 = new Color(red: 0.176f, green: 0.075f, blue: 0.055f, alpha: 1.000f);
    public static Color ColorCoreOrange200 = new Color(red: 1.000f, green: 0.776f, blue: 0.643f, alpha: 1.000f);
    public static Color ColorCoreOrange300 = new Color(red: 1.000f, green: 0.694f, blue: 0.502f, alpha: 1.000f);
    public static Color ColorCoreOrange400 = new Color(red: 1.000f, green: 0.612f, blue: 0.365f, alpha: 1.000f);
    public static Color ColorCoreOrange500 = new Color(red: 0.988f, green: 0.537f, blue: 0.263f, alpha: 1.000f);
    public static Color ColorCoreOrange600 = new Color(red: 0.961f, green: 0.490f, blue: 0.200f, alpha: 1.000f);
    public static Color ColorCoreOrange700 = new Color(red: 0.929f, green: 0.439f, blue: 0.141f, alpha: 1.000f);
    public static Color ColorCoreOrange800 = new Color(red: 0.808f, green: 0.333f, blue: 0.067f, alpha: 1.000f);
    public static Color ColorCoreOrange900 = new Color(red: 0.588f, green: 0.173f, blue: 0.043f, alpha: 1.000f);
    public static Color ColorCorePink0 = new Color(red: 1.000f, green: 0.914f, blue: 0.953f, alpha: 1.000f);
    public static Color ColorCorePink100 = new Color(red: 0.988f, green: 0.859f, blue: 0.922f, alpha: 1.000f);
    public static Color ColorCorePink1000 = new Color(red: 0.337f, green: 0.071f, blue: 0.192f, alpha: 1.000f);
    public static Color ColorCorePink1100 = new Color(red: 0.169f, green: 0.090f, blue: 0.129f, alpha: 1.000f);
    public static Color ColorCorePink200 = new Color(red: 1.000f, green: 0.710f, blue: 0.835f, alpha: 1.000f);
    public static Color ColorCorePink300 = new Color(red: 1.000f, green: 0.584f, blue: 0.757f, alpha: 1.000f);
    public static Color ColorCorePink400 = new Color(red: 1.000f, green: 0.463f, blue: 0.682f, alpha: 1.000f);
    public static Color ColorCorePink500 = new Color(red: 0.937f, green: 0.345f, blue: 0.545f, alpha: 1.000f);
    public static Color ColorCorePink600 = new Color(red: 0.878f, green: 0.267f, blue: 0.486f, alpha: 1.000f);
    public static Color ColorCorePink700 = new Color(red: 0.808f, green: 0.212f, blue: 0.396f, alpha: 1.000f);
    public static Color ColorCorePink800 = new Color(red: 0.698f, green: 0.184f, blue: 0.357f, alpha: 1.000f);
    public static Color ColorCorePink900 = new Color(red: 0.576f, green: 0.094f, blue: 0.278f, alpha: 1.000f);
    public static Color ColorCorePurple0 = new Color(red: 0.949f, green: 0.949f, blue: 0.976f, alpha: 1.000f);
    public static Color ColorCorePurple100 = new Color(red: 0.918f, green: 0.918f, blue: 0.976f, alpha: 1.000f);
    public static Color ColorCorePurple1000 = new Color(red: 0.176f, green: 0.141f, blue: 0.420f, alpha: 1.000f);
    public static Color ColorCorePurple1100 = new Color(red: 0.114f, green: 0.114f, blue: 0.220f, alpha: 1.000f);
    public static Color ColorCorePurple200 = new Color(red: 0.847f, green: 0.843f, blue: 0.976f, alpha: 1.000f);
    public static Color ColorCorePurple300 = new Color(red: 0.757f, green: 0.757f, blue: 0.969f, alpha: 1.000f);
    public static Color ColorCorePurple400 = new Color(red: 0.631f, green: 0.576f, blue: 0.949f, alpha: 1.000f);
    public static Color ColorCorePurple500 = new Color(red: 0.569f, green: 0.502f, blue: 0.957f, alpha: 1.000f);
    public static Color ColorCorePurple600 = new Color(red: 0.506f, green: 0.435f, blue: 0.918f, alpha: 1.000f);
    public static Color ColorCorePurple700 = new Color(red: 0.435f, green: 0.369f, blue: 0.827f, alpha: 1.000f);
    public static Color ColorCorePurple800 = new Color(red: 0.369f, green: 0.306f, blue: 0.729f, alpha: 1.000f);
    public static Color ColorCorePurple900 = new Color(red: 0.282f, green: 0.227f, blue: 0.612f, alpha: 1.000f);
    public static Color ColorCoreRed0 = new Color(red: 1.000f, green: 0.918f, blue: 0.914f, alpha: 1.000f);
    public static Color ColorCoreRed100 = new Color(red: 1.000f, green: 0.835f, blue: 0.824f, alpha: 1.000f);
    public static Color ColorCoreRed1000 = new Color(red: 0.427f, green: 0.075f, blue: 0.075f, alpha: 1.000f);
    public static Color ColorCoreRed1100 = new Color(red: 0.169f, green: 0.067f, blue: 0.067f, alpha: 1.000f);
    public static Color ColorCoreRed200 = new Color(red: 1.000f, green: 0.722f, blue: 0.694f, alpha: 1.000f);
    public static Color ColorCoreRed300 = new Color(red: 1.000f, green: 0.612f, blue: 0.561f, alpha: 1.000f);
    public static Color ColorCoreRed400 = new Color(red: 1.000f, green: 0.498f, blue: 0.431f, alpha: 1.000f);
    public static Color ColorCoreRed500 = new Color(red: 0.969f, green: 0.376f, blue: 0.329f, alpha: 1.000f);
    public static Color ColorCoreRed600 = new Color(red: 0.929f, green: 0.298f, blue: 0.259f, alpha: 1.000f);
    public static Color ColorCoreRed700 = new Color(red: 0.859f, green: 0.243f, blue: 0.243f, alpha: 1.000f);
    public static Color ColorCoreRed800 = new Color(red: 0.776f, green: 0.204f, blue: 0.204f, alpha: 1.000f);
    public static Color ColorCoreRed900 = new Color(red: 0.600f, green: 0.133f, blue: 0.133f, alpha: 1.000f);
    public static Color ColorCoreTeal0 = new Color(red: 0.898f, green: 0.976f, blue: 0.961f, alpha: 1.000f);
    public static Color ColorCoreTeal100 = new Color(red: 0.804f, green: 0.969f, blue: 0.937f, alpha: 1.000f);
    public static Color ColorCoreTeal1000 = new Color(red: 0.031f, green: 0.247f, blue: 0.247f, alpha: 1.000f);
    public static Color ColorCoreTeal1100 = new Color(red: 0.000f, green: 0.145f, blue: 0.157f, alpha: 1.000f);
    public static Color ColorCoreTeal200 = new Color(red: 0.702f, green: 0.949f, blue: 0.902f, alpha: 1.000f);
    public static Color ColorCoreTeal300 = new Color(red: 0.490f, green: 0.918f, blue: 0.835f, alpha: 1.000f);
    public static Color ColorCoreTeal400 = new Color(red: 0.141f, green: 0.878f, blue: 0.773f, alpha: 1.000f);
    public static Color ColorCoreTeal500 = new Color(red: 0.031f, green: 0.769f, blue: 0.698f, alpha: 1.000f);
    public static Color ColorCoreTeal600 = new Color(red: 0.000f, green: 0.663f, blue: 0.612f, alpha: 1.000f);
    public static Color ColorCoreTeal700 = new Color(red: 0.043f, green: 0.588f, blue: 0.561f, alpha: 1.000f);
    public static Color ColorCoreTeal800 = new Color(red: 0.024f, green: 0.486f, blue: 0.486f, alpha: 1.000f);
    public static Color ColorCoreTeal900 = new Color(red: 0.008f, green: 0.400f, blue: 0.380f, alpha: 1.000f);
    public static Color ColorCoreYellow0 = new Color(red: 1.000f, green: 0.973f, blue: 0.886f, alpha: 1.000f);
    public static Color ColorCoreYellow100 = new Color(red: 0.992f, green: 0.937f, blue: 0.804f, alpha: 1.000f);
    public static Color ColorCoreYellow1000 = new Color(red: 0.329f, green: 0.165f, blue: 0.000f, alpha: 1.000f);
    public static Color ColorCoreYellow1100 = new Color(red: 0.176f, green: 0.102f, blue: 0.020f, alpha: 1.000f);
    public static Color ColorCoreYellow200 = new Color(red: 1.000f, green: 0.914f, blue: 0.604f, alpha: 1.000f);
    public static Color ColorCoreYellow300 = new Color(red: 1.000f, green: 0.882f, blue: 0.431f, alpha: 1.000f);
    public static Color ColorCoreYellow400 = new Color(red: 1.000f, green: 0.851f, blue: 0.263f, alpha: 1.000f);
    public static Color ColorCoreYellow500 = new Color(red: 1.000f, green: 0.804f, blue: 0.110f, alpha: 1.000f);
    public static Color ColorCoreYellow600 = new Color(red: 1.000f, green: 0.737f, blue: 0.000f, alpha: 1.000f);
    public static Color ColorCoreYellow700 = new Color(red: 0.867f, green: 0.600f, blue: 0.012f, alpha: 1.000f);
    public static Color ColorCoreYellow800 = new Color(red: 0.729f, green: 0.459f, blue: 0.024f, alpha: 1.000f);
    public static Color ColorCoreYellow900 = new Color(red: 0.580f, green: 0.298f, blue: 0.047f, alpha: 1.000f);
    public static Color ColorFontDanger = new Color(red: 0.427f, green: 0.075f, blue: 0.075f, alpha: 1.000f);
    public static Color ColorFontInteractive = new Color(red: 0.043f, green: 0.522f, blue: 0.600f, alpha: 1.000f);
    public static Color ColorFontInteractiveActive = new Color(red: 0.435f, green: 0.369f, blue: 0.827f, alpha: 1.000f);
    public static Color ColorFontInteractiveDisabled = new Color(red: 0.212f, green: 0.255f, blue: 0.255f, alpha: 1.000f);
    public static Color ColorFontInteractiveHover = new Color(red: 0.043f, green: 0.522f, blue: 0.600f, alpha: 1.000f);
    public static Color ColorFontPrimary = new Color(red: 0.016f, green: 0.016f, blue: 0.016f, alpha: 1.000f);
    public static Color ColorFontSecondary = new Color(red: 0.153f, green: 0.200f, blue: 0.200f, alpha: 1.000f);
    public static Color ColorFontSuccess = new Color(red: 0.031f, green: 0.259f, blue: 0.184f, alpha: 1.000f);
    public static Color ColorFontTertiary = new Color(red: 0.212f, green: 0.255f, blue: 0.255f, alpha: 1.000f);
    public static Color ColorFontWarning = new Color(red: 0.376f, green: 0.090f, blue: 0.000f, alpha: 1.000f);
}`;
/* end snapshot integration dotnet color dotnet/class.cs should match snapshot */

