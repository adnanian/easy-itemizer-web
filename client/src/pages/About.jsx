import StyledTitle from "../components/StyledTitle";
import '../styles/About.css';

/**
 * Displays a simple page of information about Easy Itemizer.
 * 
 * @returns an about page.
 */
export default function About() {
    return (
        <main>
            <StyledTitle text="About Easy Itemizer"/>
            <article>
                
                <section>
                    <h2>Introduction</h2>
                    <p>
                        Easy Itemizer is a simple tool for allowing organizations to
                        manage their inventories of non-stock items. Each member
                        of an organization can add items in their local system
                        to track their quantities. This is to ensure that when
                        an item is running low in terms of quantity, organizations
                        are prepared in advance, so that they can order more, and
                        expect more items to arrive before depleting their supplies.
                    </p>
                    <p>
                        There are numerous examples of real world applications for a
                        scenario like this. One example is tracking how many rolls of
                        toilet paper you have in your bathroom. You would never want to
                        be in a situation where you discover, while using the toilet,
                        that you are all out of rolls. A situation like this would be
                        quite embarrassing.
                    </p>
                    <p>
                        With Easy Itemizer, you will always know the exact count. The
                        intended idea is that you would have to physically 
                        count each type of item only once. Once you have done so,
                        you could record that information in the system; Then,
                        from that point forward, when you completely use up an
                        item, all you would have to do is click the minus button,
                        so that it automatically subtracts your current stock by 1.
                        When you receive more items, you can simply click the plus
                        button to add more.
                    </p>
                </section>
                <section>
                    <h2>Background</h2>
                    <p>
                        The idea for Easy Itemizer started in October 2023. At that
                        time, I was noticing the need for having an easily available
                        system for a visual, numerical system for all items that I,
                        or my organization uses. Whenever we finish an item, we don't
                        realize that we are all out, until we check our storage
                        for more. As mentioned before, we would have to purchase
                        more of these items and wait days for them to come. This
                        can become tedious and frustrating very fast.
                    </p>
                    <p>
                        Several suggestions for a solution have been proposed.
                        Some have suggested to write on the item a number in the
                        format of 1 of 9, {"("}e.g. this is the first of our nine{")"}.
                        But that itself is also tedious, because it involves constant
                        tampering with parts. Others have suggested the use of a
                        spreadsheet. Spreadsheets wouldn't be so feasible either
                        because spredsheets are meant for data analysis, not storing
                        information. After other solutions have been tried, there was
                        finally a proposal to create an application and database.
                    </p>
                    <p>
                        This application and database, would not only efficiently store
                        an organization's inventory information, but also make it visually
                        appealing. We would have an image of what the item looks like, in
                        case we ever need one. We can easily adjust the quantities Whenever
                        we make an error. And we can always notify the team about any item
                        shortages, so that communication is early, clear, proactive, and swift.
                        This eliminates assumptions and negligence on all levels.
                    </p>
                    <p>
                        Easy Itemizer's first draft was finally completed in May 2024, after many phases of trial
                        and error. The first version of this application allows you to create
                        accounts, create organizations, add items to manage, and manage user
                        access to organizations. The first version is a coding bootcamp project that wasn't deployed.
                        At that time it was named Itemizer. In the next version, which was completed in June 2024,
                        it was renamed Easy Itemizer.
                    </p>
                </section>
                <section>
                    <h2>Conclusion</h2>
                    <p>
                        Easy Itemizer is a simple application for managing non-stock items.
                        You can use this application for individual purposes or on an organizational
                        level. You can even use this with family members to manage house affairs.
                        Go ahead and create an account to check out all the cool features that you
                        can do, and let there be one less headache in your life.
                    </p>
                </section>
            </article>
        </main>
    )
}